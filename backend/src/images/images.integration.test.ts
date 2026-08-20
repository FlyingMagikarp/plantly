import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Server } from 'node:http';
import request from 'supertest';
import { GenericContainer, type StartedTestContainer, Wait } from 'testcontainers';
import { DataSource, Repository } from 'typeorm';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateSpecies1786449600000 } from '../database/migrations/1786449600000-CreateSpecies';
import { CreateLocations1786453200000 } from '../database/migrations/1786453200000-CreateLocations';
import { CreatePlants1786454626591 } from '../database/migrations/1786454626591-CreatePlants';
import { CreatePlantImages1786510000000 } from '../database/migrations/1786510000000-CreatePlantImages';
import { Location } from '../locations/location.entity';
import { Plant } from '../plants/plant.entity';
import { PlantsModule } from '../plants/plants.module';
import { Species } from '../species/species.entity';
import { ImagesModule } from './images.module';
import { PlantImage } from './plant-image.entity';
import type { PlantImageView } from './images.service';
import { ImageStorageService } from './image-storage.service';

const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]);
const jpeg = Buffer.from([255, 216, 255, 224, 1, 2, 3]);

describe('UC-022, UC-024 and UC-025: Plant Images', () => {
  let container: StartedTestContainer; let app: INestApplication; let dataSource: DataSource;
  let plants: Repository<Plant>; let species: Repository<Species>; let images: Repository<PlantImage>; let storagePath: string;
  let storage: ImageStorageService;

  beforeAll(async () => {
    storagePath = await mkdtemp(join(tmpdir(), 'plantly-images-'));
    process.env.IMAGE_STORAGE_PATH = storagePath;
    container = await new GenericContainer('postgres:18-alpine').withEnvironment({ POSTGRES_DB: 'plantly_images_tests', POSTGRES_USER: 'plantly_test', POSTGRES_PASSWORD: 'plantly_test' }).withExposedPorts(5432).withWaitStrategy(Wait.forLogMessage(/database system is ready to accept connections/, 2)).withStartupTimeout(120_000).start();
    const connection = { type: 'postgres' as const, host: container.getHost(), port: container.getMappedPort(5432), database: 'plantly_images_tests', username: 'plantly_test', password: 'plantly_test' };
    const entities = [Species, Location, Plant, PlantImage];
    const migrations = new DataSource({ ...connection, entities, migrations: [CreateSpecies1786449600000, CreateLocations1786453200000, CreatePlants1786454626591, CreatePlantImages1786510000000], synchronize: false });
    await migrations.initialize(); await migrations.runMigrations(); await migrations.destroy();
    const moduleRef = await Test.createTestingModule({ imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRoot({ ...connection, entities, synchronize: false }), ImagesModule, PlantsModule] }).compile();
    app = moduleRef.createNestApplication(); app.setGlobalPrefix('api'); app.useLogger(false); await app.init();
    dataSource = app.get(DataSource); plants = dataSource.getRepository(Plant); species = dataSource.getRepository(Species); images = dataSource.getRepository(PlantImage); storage = app.get(ImageStorageService);
  }, 120_000);

  beforeEach(async () => { await images.createQueryBuilder().delete().execute(); await plants.createQueryBuilder().delete().execute(); await species.createQueryBuilder().delete().execute(); await rm(storagePath, { recursive: true, force: true }); });
  afterAll(async () => { await app?.close(); await container?.stop(); await rm(storagePath, { recursive: true, force: true }); delete process.env.IMAGE_STORAGE_PATH; }, 30_000);

  it('attaches valid JPEG and PNG files without metadata and serves their exact content', async () => {
    const plant = await savePlant();
    const first = await request(server()).post(`/api/plants/${plant.id}/images`).attach('image', jpeg, { filename: 'plant.jpg', contentType: 'image/jpeg' }).expect(201);
    const second = await request(server()).post(`/api/plants/${plant.id}/images`).attach('image', png, { filename: 'plant.png', contentType: 'image/png' }).expect(201);
    expect(await images.countBy({ plantId: plant.id })).toBe(2);
    expect(first.body).not.toHaveProperty('storageKey');
    const content = await request(server()).get((second.body as unknown as PlantImageView).contentUrl).expect('Content-Type', /image\/png/).expect(200);
    expect(content.body).toEqual(png);
  });

  it('rejects invalid content, unsupported media, oversized files, inactive plants, and missing plants without orphan files', async () => {
    const plant = await savePlant();
    await request(server()).post(`/api/plants/${plant.id}/images`).attach('image', Buffer.from('not png'), { filename: 'fake.png', contentType: 'image/png' }).expect(400);
    await request(server()).post(`/api/plants/${plant.id}/images`).attach('image', Buffer.from('text'), { filename: 'plant.txt', contentType: 'text/plain' }).expect(400);
    await request(server()).post(`/api/plants/${plant.id}/images`).attach('image', Buffer.concat([png, Buffer.alloc(10 * 1024 * 1024)])).expect(400);
    plant.status = 'dead'; await plants.save(plant);
    await request(server()).post(`/api/plants/${plant.id}/images`).attach('image', png, { filename: 'plant.png', contentType: 'image/png' }).expect(409);
    await request(server()).post('/api/plants/999/images').attach('image', png, { filename: 'plant.png', contentType: 'image/png' }).expect(404);
    expect(await images.count()).toBe(0);
  });

  it('reports attachment failure without metadata or orphan content and permits retry', async () => {
    const plant = await savePlant(); const failure = vi.spyOn(storage, 'write').mockRejectedValueOnce(new Error('storage unavailable'));
    await request(server()).post(`/api/plants/${plant.id}/images`).attach('image', png, { filename: 'plant.png', contentType: 'image/png' }).expect(500);
    expect(await images.count()).toBe(0); failure.mockRestore();
    await request(server()).post(`/api/plants/${plant.id}/images`).attach('image', png, { filename: 'plant.png', contentType: 'image/png' }).expect(201);
    expect(await images.count()).toBe(1);
  });

  it('lists every retained image newest first with identifier tie-breaking and preserves inactive plant images', async () => {
    const plant = await savePlant();
    const older = await saveImage(plant.id, 'older.png', '2026-08-10T10:00:00Z');
    const tiedFirst = await saveImage(plant.id, 'tie-a.png', '2026-08-11T10:00:00Z');
    const tiedSecond = await saveImage(plant.id, 'tie-b.png', '2026-08-11T10:00:00Z');
    plant.status = 'archived'; await plants.save(plant);
    const response = await request(server()).get(`/api/plants/${plant.id}/images`).expect(200);
    expect((response.body as unknown as PlantImageView[]).map((item) => item.id)).toEqual([tiedSecond.id, tiedFirst.id, older.id]);
  });

  it('returns an empty collection, isolates missing plants, and reports unavailable content without hiding other images', async () => {
    const plant = await savePlant(); const other = await savePlant('Other');
    expect((await request(server()).get(`/api/plants/${plant.id}/images`).expect(200)).body).toEqual([]);
    await saveImage(other.id, 'other.png', '2026-08-11T10:00:00Z');
    await request(server()).get('/api/plants/999/images').expect(404);
    const missing = await saveImage(plant.id, 'missing.png', '2026-08-12T10:00:00Z');
    const available = await saveImage(plant.id, 'available.png', '2026-08-11T10:00:00Z'); await mkdir(storagePath, { recursive: true }); await writeFile(join(storagePath, 'available.png'), png);
    await request(server()).get(`/api/plants/${plant.id}/images/${missing.id}/content`).expect(404);
    await request(server()).get(`/api/plants/${plant.id}/images/${available.id}/content`).expect(200);
  });

  it('removes only the confirmed active-plant image and rejects stale, foreign, and inactive removal', async () => {
    const plant = await savePlant(); const other = await savePlant('Other');
    const selected = await saveImage(plant.id, 'selected.png', '2026-08-11T10:00:00Z'); const retained = await saveImage(plant.id, 'retained.png', '2026-08-10T10:00:00Z'); const foreign = await saveImage(other.id, 'foreign.png', '2026-08-09T10:00:00Z');
    await mkdir(storagePath, { recursive: true }); await writeFile(join(storagePath, 'selected.png'), png); await writeFile(join(storagePath, 'retained.png'), png);
    await request(server()).delete(`/api/plants/${plant.id}/images/${foreign.id}`).expect(404);
    await request(server()).delete(`/api/plants/${plant.id}/images/${selected.id}`).expect(200);
    await expect(readFile(join(storagePath, 'selected.png'))).rejects.toThrow();
    expect(await images.findBy({ plantId: plant.id })).toEqual([expect.objectContaining({ id: retained.id })]);
    plant.status = 'dead'; await plants.save(plant);
    await request(server()).delete(`/api/plants/${plant.id}/images/${retained.id}`).expect(409);
    await request(server()).delete(`/api/plants/${plant.id}/images/999`).expect(409);
  });

  it('reports removal failure while retaining the image and stored content for retry', async () => {
    const plant = await savePlant(); const retained = await saveImage(plant.id, 'failure.png', '2026-08-11T10:00:00Z'); await mkdir(storagePath, { recursive: true }); await writeFile(join(storagePath, 'failure.png'), png);
    const failure = vi.spyOn(dataSource, 'transaction').mockRejectedValueOnce(new Error('database unavailable'));
    await request(server()).delete(`/api/plants/${plant.id}/images/${retained.id}`).expect(500); failure.mockRestore();
    expect(await images.findOneBy({ id: retained.id })).not.toBeNull(); expect(await readFile(join(storagePath, 'failure.png'))).toEqual(png);
    await request(server()).delete(`/api/plants/${plant.id}/images/${retained.id}`).expect(200);
  });

  it('permanently deleting a plant cascades image metadata and removes stored content', async () => {
    const plant = await savePlant(); await saveImage(plant.id, 'cascade.png', '2026-08-11T10:00:00Z'); await mkdir(storagePath, { recursive: true }); await writeFile(join(storagePath, 'cascade.png'), png);
    await request(server()).delete(`/api/plants/${plant.id}`).expect(204);
    expect(await images.countBy({ plantId: plant.id })).toBe(0); await expect(readFile(join(storagePath, 'cascade.png'))).rejects.toThrow();
  });

  function server(): Server { return app.getHttpServer() as Server; }
  async function savePlant(nickname = 'Hoya'): Promise<Plant> { let item = await species.findOneBy({ id: 1 }); if (!item) item = await species.save(species.create({ id: 1, definitionSlug: 'test-species', name: 'Test species', moisture: 'moist', light: 'bright-indirect', preferredTemperatureMin: 18, preferredTemperatureMax: 28, minimumTemperature: 12, growthPeriod: 'March-October', bloomPeriod: 'unknown', dormancyPeriod: 'November-February', growthFertilizer: 'balanced', bloomFertilizer: 'species-specific', dormancyFertilizer: 'none', notes: [], sourceHash: '1'.padEnd(64, '0'), archived: false })); return plants.save(plants.create({ nickname, speciesId: item.id, acquisitionDate: '2025-01-01', notes: null, status: 'active', locationId: null })); }
  async function saveImage(plantId: number, storageKey: string, addedAt: string): Promise<PlantImage> { return images.save(images.create({ plantId, storageKey, mediaType: 'image/png', byteSize: png.length, addedAt: new Date(addedAt) })); }
});

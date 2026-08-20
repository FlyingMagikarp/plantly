import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Server } from 'node:http';
import request from 'supertest';
import { GenericContainer, type StartedTestContainer, Wait } from 'testcontainers';
import { DataSource, Repository } from 'typeorm';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CareEvent } from '../care-events/care-event.entity';
import { CareEventClock } from '../care-events/care-events.service';
import { CreateSpecies1786449600000 } from '../database/migrations/1786449600000-CreateSpecies';
import { CreateLocations1786453200000 } from '../database/migrations/1786453200000-CreateLocations';
import { CreatePlants1786454626591 } from '../database/migrations/1786454626591-CreatePlants';
import { CreateCareEvents1786500000000 } from '../database/migrations/1786500000000-CreateCareEvents';
import { CreatePlantImages1786510000000 } from '../database/migrations/1786510000000-CreatePlantImages';
import { CreateCareRounds1786520000000 } from '../database/migrations/1786520000000-CreateCareRounds';
import { PlantImage } from '../images/plant-image.entity';
import { Location } from '../locations/location.entity';
import { Plant } from '../plants/plant.entity';
import { Species } from '../species/species.entity';
import { CareRoundMember } from './care-round-member.entity';
import { CareRound } from './care-round.entity';
import { CareRoundsModule } from './care-rounds.module';
import type { CareRoundView } from './care-rounds.service';

const now = new Date('2026-08-20T10:00:00.000Z');

describe('UC-030 through UC-032: Plant Care Rounds', () => {
  let container: StartedTestContainer; let app: INestApplication; let source: DataSource;
  let species: Repository<Species>; let locations: Repository<Location>; let plants: Repository<Plant>; let rounds: Repository<CareRound>; let members: Repository<CareRoundMember>; let events: Repository<CareEvent>;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:18-alpine').withEnvironment({ POSTGRES_DB: 'plantly_round_tests', POSTGRES_USER: 'plantly_test', POSTGRES_PASSWORD: 'plantly_test' }).withExposedPorts(5432).withWaitStrategy(Wait.forLogMessage(/database system is ready to accept connections/, 2)).withStartupTimeout(120_000).start();
    const connection = { type: 'postgres' as const, host: container.getHost(), port: container.getMappedPort(5432), database: 'plantly_round_tests', username: 'plantly_test', password: 'plantly_test' };
    const entities = [Species, Location, Plant, CareEvent, PlantImage, CareRound, CareRoundMember];
    const migrationSource = new DataSource({ ...connection, entities, migrations: [CreateSpecies1786449600000, CreateLocations1786453200000, CreatePlants1786454626591, CreateCareEvents1786500000000, CreatePlantImages1786510000000, CreateCareRounds1786520000000], synchronize: false });
    await migrationSource.initialize();
    await migrationSource.runMigrations();
    await migrationSource.undoLastMigration();
    await migrationSource.runMigrations();
    await migrationSource.undoLastMigration();
    await migrationSource.undoLastMigration();
    await migrationSource.runMigrations();
    await migrationSource.destroy();
    const moduleRef = await Test.createTestingModule({ imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRoot({ ...connection, entities, synchronize: false }), CareRoundsModule] }).overrideProvider(CareEventClock).useValue({ now: () => now }).compile();
    app = moduleRef.createNestApplication(); app.setGlobalPrefix('api'); app.useLogger(false); await app.init();
    source = app.get(DataSource); species = source.getRepository(Species); locations = source.getRepository(Location); plants = source.getRepository(Plant); rounds = source.getRepository(CareRound); members = source.getRepository(CareRoundMember); events = source.getRepository(CareEvent);
  }, 120_000);

  beforeEach(async () => { await events.createQueryBuilder().delete().execute(); await members.createQueryBuilder().delete().execute(); await rounds.createQueryBuilder().delete().execute(); await plants.createQueryBuilder().delete().execute(); await locations.createQueryBuilder().delete().execute(); await species.createQueryBuilder().delete().execute(); await saveSpecies(); });
  afterAll(async () => { await app?.close(); await container?.stop(); }, 30_000);

  it('offers populated locations by ascending ID and the unassigned group without empty locations', async () => {
    const second = await saveLocation('Second', 2); const first = await saveLocation('First', 1); await saveLocation('Empty', 3);
    await savePlant('Second plant', second.id); await savePlant('First plant', first.id); await savePlant('Unassigned', null); await savePlant('Dead', first.id, 'dead');
    const response = await request(server()).get('/api/care-rounds/options').expect(200);
    expect(response.body).toEqual([{ locationId: 1, name: 'First', plantCount: 1 }, { locationId: 2, name: 'Second', plantCount: 1 }, { locationId: null, name: 'No location', plantCount: 1 }]);
  });

  it('starts a persistent ordered snapshot, creates no event, and reopens it instead of starting another', async () => {
    const location = await saveLocation('Shelf', 1); const laterId = await savePlant('Later', location.id); const earlierId = await savePlant('Earlier', location.id);
    const started = await request(server()).post('/api/care-rounds').send({ locationId: location.id }).expect(201);
    const startedBody = started.body as unknown as CareRoundView;
    expect(startedBody.members.map((member) => member.plantId)).toEqual([laterId.id, earlierId.id].sort((a, b) => a - b));
    expect(startedBody.currentIndex).toBe(0); expect(await events.count()).toBe(0);
    await request(server()).post('/api/care-rounds').send({ locationId: null }).expect(409);
    const reopened = await request(server()).get('/api/care-rounds/active').expect(200);
    expect((reopened.body as unknown as CareRoundView).id).toBe(startedBody.id); expect(await rounds.countBy({ status: 'active' })).toBe(1);
  });

  it('rejects missing and empty selections without creating a partial round', async () => {
    const empty = await saveLocation('Empty', 1);
    await request(server()).post('/api/care-rounds').send({ locationId: empty.id }).expect(409);
    await request(server()).post('/api/care-rounds').send({ locationId: 999 }).expect(404);
    await request(server()).post('/api/care-rounds').send({ locationId: null }).expect(409);
    expect(await rounds.count()).toBe(0); expect(await members.count()).toBe(0);
  });

  it('reports a start failure without partial round state and allows retry', async () => {
    await savePlant('Unassigned', null); const failure = vi.spyOn(source, 'transaction').mockRejectedValueOnce(new Error('database unavailable'));
    await request(server()).post('/api/care-rounds').send({ locationId: null }).expect(500); failure.mockRestore();
    expect(await rounds.count()).toBe(0); expect(await members.count()).toBe(0);
    await request(server()).post('/api/care-rounds').send({ locationId: null }).expect(201);
  });

  it('records multiple supported events for only the current active plant and keeps it current', async () => {
    const plant = await savePlant('Current', null); const started = await startUnassigned();
    await record(started.id, plant.id, { type: 'watering', timestamp: '2026-08-20T09:00:00.000Z', fertilizerIncluded: true }).expect(201);
    await record(started.id, plant.id, { type: 'observation', timestamp: '2026-08-20T09:30:00.000Z' }).expect(201);
    const stored = await events.find({ where: { plantId: plant.id }, order: { id: 'ASC' } });
    expect(stored).toHaveLength(2); expect(stored.every((event) => event.roundId === started.id)).toBe(true); expect(stored[0]).toMatchObject({ type: 'watering', fertilizerIncluded: true });
    expect(((await request(server()).get('/api/care-rounds/active')).body as unknown as CareRoundView).currentIndex).toBe(0);
    const other = await savePlant('Other', null); await record(started.id, other.id, { type: 'pruning', timestamp: '2026-08-20T09:00:00.000Z' }).expect(409);
    plant.status = 'dead'; await plants.save(plant); await record(started.id, plant.id, { type: 'pruning', timestamp: '2026-08-20T09:00:00.000Z' }).expect(409);
    expect(await events.count()).toBe(2);
  });

  it('moves, skips, and returns through the unchanged snapshot without creating care', async () => {
    const location = await saveLocation('Shelf', 1); const first = await savePlant('First', location.id); const second = await savePlant('Second', location.id); const started = await request(server()).post('/api/care-rounds').send({ locationId: location.id }); const startedBody = started.body as unknown as CareRoundView;
    first.locationId = null; await plants.save(first);
    let response = await request(server()).patch(`/api/care-rounds/${startedBody.id}/progress`).send({ direction: 'next' }).expect(200); let responseBody = response.body as unknown as CareRoundView; expect(responseBody.currentIndex).toBe(1); expect(responseBody.members.map((member) => member.plantId)).toEqual([first.id, second.id]);
    response = await request(server()).patch(`/api/care-rounds/${startedBody.id}/progress`).send({ direction: 'previous' }).expect(200); responseBody = typedBody<CareRoundView>(response); expect(responseBody.currentIndex).toBe(0);
    await request(server()).patch(`/api/care-rounds/${startedBody.id}/progress`).send({ direction: 'next' }).expect(200); await request(server()).patch(`/api/care-rounds/${startedBody.id}/progress`).send({ direction: 'next' }).expect(200);
    expect(((await request(server()).get('/api/care-rounds/active')).body as unknown as CareRoundView).currentIndex).toBe(2); expect(await events.count()).toBe(0);
  });

  it('completes early with a unique cared-plant summary and preserves every event unchanged', async () => {
    const first = await savePlant('First', null); const second = await savePlant('Skipped', null); const started = await startUnassigned();
    await record(started.id, first.id, { type: 'watering', timestamp: '2026-08-20T09:00:00.000Z' }).expect(201); await record(started.id, first.id, { type: 'pruning', timestamp: '2026-08-20T09:10:00.000Z' }).expect(201);
    const before = await events.find({ order: { id: 'ASC' } });
    const completed = await request(server()).patch(`/api/care-rounds/${started.id}/complete`).expect(200);
    const completedBody = completed.body as unknown as CareRoundView;
    expect(completedBody.status).toBe('completed'); expect(completedBody.summary.map((item) => item.plantId)).toEqual([first.id]); expect(completedBody.summary).not.toEqual(expect.arrayContaining([expect.objectContaining({ plantId: second.id })]));
    expect(await events.find({ order: { id: 'ASC' } })).toEqual(before); expect(await rounds.countBy({ status: 'active' })).toBe(0); expect(await rounds.countBy({ status: 'completed' })).toBe(1);
    await request(server()).patch(`/api/care-rounds/${started.id}/complete`).expect(409); expect(await rounds.countBy({ status: 'completed' })).toBe(1);
  });

  it('completes a no-event round without inventing activity', async () => {
    await savePlant('Uncared', null); const started = await startUnassigned(); const completed = await request(server()).patch(`/api/care-rounds/${started.id}/complete`).expect(200);
    expect((completed.body as unknown as CareRoundView).summary).toEqual([]); expect(await events.count()).toBe(0);
  });

  it('reports completion failure while preserving the active round, progress, and events for retry', async () => {
    const plant = await savePlant('Current', null); const started = await startUnassigned(); await record(started.id, plant.id, { type: 'observation', timestamp: '2026-08-20T09:00:00.000Z' }).expect(201);
    const failure = vi.spyOn(source, 'transaction').mockRejectedValueOnce(new Error('database unavailable'));
    await request(server()).patch(`/api/care-rounds/${started.id}/complete`).expect(500); failure.mockRestore();
    expect(await rounds.findOneBy({ id: started.id })).toMatchObject({ status: 'active', currentIndex: 0 }); expect(await events.countBy({ roundId: started.id })).toBe(1);
    await request(server()).patch(`/api/care-rounds/${started.id}/complete`).expect(200);
  });

  function server(): Server { return app.getHttpServer() as Server; }
  function record(roundId: number, plantId: number, body: object) { return request(server()).post(`/api/care-rounds/${roundId}/plants/${plantId}/care-events`).send(body); }
  async function startUnassigned(): Promise<{ id: number }> { return typedBody<{ id: number }>(await request(server()).post('/api/care-rounds').send({ locationId: null }).expect(201)); }
  async function saveSpecies(): Promise<Species> { return species.save(species.create({ id: 1, definitionSlug: 'test-species', name: 'Test species', moisture: 'moist', light: 'bright-indirect', preferredTemperatureMin: 18, preferredTemperatureMax: 28, minimumTemperature: 12, growthPeriod: 'March-October', bloomPeriod: 'unknown', dormancyPeriod: 'November-February', growthFertilizer: 'balanced', bloomFertilizer: 'species-specific', dormancyFertilizer: 'none', notes: [], sourceHash: '1'.padEnd(64, '0'), archived: false })); }
  async function saveLocation(name: string, id: number): Promise<Location> { return locations.save(locations.create({ id, name })); }
  function savePlant(nickname: string, locationId: number | null, status: 'active' | 'dead' | 'archived' = 'active'): Promise<Plant> { return plants.save(plants.create({ nickname, speciesId: 1, acquisitionDate: '2025-01-01', notes: null, status, locationId })); }
});

function typedBody<T>(response: { body: unknown }): T { return response.body as T; }

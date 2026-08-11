import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Server } from 'node:http';
import request from 'supertest';
import {
  GenericContainer,
  type StartedTestContainer,
  Wait,
} from 'testcontainers';
import { DataSource, Repository } from 'typeorm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { CreateSpecies1786449600000 } from '../database/migrations/1786449600000-CreateSpecies';
import { CreateLocations1786453200000 } from '../database/migrations/1786453200000-CreateLocations';
import { CreatePlants1786454626591 } from '../database/migrations/1786454626591-CreatePlants';
import { Location } from '../locations/location.entity';
import { Plant } from '../plants/plant.entity';
import { Species } from './species.entity';
import { SpeciesModule } from './species.module';

const postgresPort = 5432;
const databaseName = 'plantly_species_query_tests';
const databaseUser = 'plantly_test';
const databasePassword = 'plantly_test';

describe('Species query API', () => {
  let container: StartedTestContainer;
  let app: INestApplication;
  let repository: Repository<Species>;
  let plants: Repository<Plant>;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:18-alpine')
      .withEnvironment({
        POSTGRES_DB: databaseName,
        POSTGRES_USER: databaseUser,
        POSTGRES_PASSWORD: databasePassword,
      })
      .withExposedPorts(postgresPort)
      .withWaitStrategy(
        Wait.forLogMessage(/database system is ready to accept connections/, 2),
      )
      .withStartupTimeout(120_000)
      .start();

    const connection = {
      type: 'postgres' as const,
      host: container.getHost(),
      port: container.getMappedPort(postgresPort),
      database: databaseName,
      username: databaseUser,
      password: databasePassword,
    };
    const migrationDataSource = new DataSource({
      ...connection,
      entities: [Species, Location, Plant],
      migrations: [
        CreateSpecies1786449600000,
        CreateLocations1786453200000,
        CreatePlants1786454626591,
      ],
      synchronize: false,
    });
    await migrationDataSource.initialize();
    await migrationDataSource.runMigrations();
    await migrationDataSource.destroy();

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          ...connection,
          entities: [Species, Location, Plant],
          synchronize: false,
        }),
        SpeciesModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useLogger(false);
    await app.init();
    const dataSource = app.get(DataSource);
    repository = dataSource.getRepository(Species);
    plants = dataSource.getRepository(Plant);
  }, 120_000);

  beforeEach(async () => {
    await plants.createQueryBuilder().delete().execute();
    await repository.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  }, 30_000);

  describe('UC-003: List Species', () => {
    it('returns every active and archived species with identity, status, and a zero plant count', async () => {
      await repository.save([
        speciesFixture({ id: 2, name: 'Zebra Plant' }),
        speciesFixture({ id: 1, name: 'Archived Fern', archived: true }),
      ]);

      const response = await request(app.getHttpServer() as Server).get(
        '/api/species',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, name: 'Archived Fern', archived: true, plantCount: 0 },
        { id: 2, name: 'Zebra Plant', archived: false, plantCount: 0 },
      ]);
    });

    it('returns an empty overview when no species exist', async () => {
      const response = await request(app.getHttpServer() as Server).get(
        '/api/species',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('returns the recorded plant count for each species, including inactive plants', async () => {
      await repository.save([
        speciesFixture({ id: 1, name: 'Hoya' }),
        speciesFixture({ id: 2, name: 'Fern' }),
      ]);
      await plants.save([
        plantFixture({ nickname: 'Active Hoya', speciesId: 1 }),
        plantFixture({ nickname: 'Archived Hoya', speciesId: 1, status: 'archived' }),
        plantFixture({ nickname: 'Dead Fern', speciesId: 2, status: 'dead' }),
      ]);

      const response = await request(app.getHttpServer() as Server).get(
        '/api/species',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, name: 'Hoya', archived: false, plantCount: 2 },
        { id: 2, name: 'Fern', archived: false, plantCount: 1 },
      ]);
    });

    it('does not modify species data while retrieving the overview', async () => {
      await repository.save(speciesFixture({ id: 8, name: 'Untouched' }));
      const before = await repository.find();

      await request(app.getHttpServer() as Server)
        .get('/api/species')
        .expect(200);

      await expect(repository.find()).resolves.toEqual(before);
    });
  });

  describe('UC-002: View Species', () => {
    it('returns the complete selected archived species detail without internal fields', async () => {
      await repository.save([
        speciesFixture({ id: 3, name: 'Another Species' }),
        speciesFixture({
          id: 7,
          name: 'Selected Species',
          archived: true,
          moisture: 'slightly-dry',
          light: 'direct',
          preferredTemperatureMin: 15,
          preferredTemperatureMax: 29,
          minimumTemperature: 10,
          growthPeriod: 'March-September',
          bloomPeriod: 'August-October',
          dormancyPeriod: 'November-February',
          growthFertilizer: 'foliage',
          bloomFertilizer: 'bloom',
          dormancyFertilizer: 'none',
          notes: ['First note.', 'Second note.'],
        }),
      ]);

      const response = await request(app.getHttpServer() as Server).get(
        '/api/species/7',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 7,
        name: 'Selected Species',
        archived: true,
        moisture: 'slightly-dry',
        light: 'direct',
        preferredTemperatureMin: 15,
        preferredTemperatureMax: 29,
        minimumTemperature: 10,
        growthPeriod: 'March-September',
        bloomPeriod: 'August-October',
        dormancyPeriod: 'November-February',
        growthFertilizer: 'foliage',
        bloomFertilizer: 'bloom',
        dormancyFertilizer: 'none',
        notes: ['First note.', 'Second note.'],
        plants: [],
      });
    });

    it('returns an empty notes collection without inventing content', async () => {
      await repository.save(
        speciesFixture({ id: 9, name: 'No Notes', notes: [] }),
      );

      const response = await request(app.getHttpServer() as Server).get(
        '/api/species/9',
      );

      expect(response.status).toBe(200);
      expect((response.body as { notes: unknown }).notes).toEqual([]);
    });

    it('lists every recorded plant associated with the species in identifier order', async () => {
      await repository.save([
        speciesFixture({ id: 1, name: 'Selected Species' }),
        speciesFixture({ id: 2, name: 'Other Species' }),
      ]);
      const first = await plants.save(
        plantFixture({ nickname: 'First plant', speciesId: 1 }),
      );
      const second = await plants.save(
        plantFixture({ nickname: 'Inactive plant', speciesId: 1, status: 'dead' }),
      );
      await plants.save(plantFixture({ nickname: 'Other plant', speciesId: 2 }));

      const response = await request(app.getHttpServer() as Server).get(
        '/api/species/1',
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        plants: [
          { id: first.id, nickname: 'First plant' },
          { id: second.id, nickname: 'Inactive plant' },
        ],
      });
    });

    it('returns 404 without another species data when the requested species is missing', async () => {
      await repository.save(speciesFixture({ id: 10, name: 'Existing' }));

      const response = await request(app.getHttpServer() as Server).get(
        '/api/species/999',
      );

      expect(response.status).toBe(404);
      expect(response.body).not.toMatchObject({ name: 'Existing' });
    });

    it('does not modify species data while retrieving its detail', async () => {
      await repository.save(speciesFixture({ id: 11, name: 'Untouched' }));
      const before = await repository.find();

      await request(app.getHttpServer() as Server)
        .get('/api/species/11')
        .expect(200);

      await expect(repository.find()).resolves.toEqual(before);
    });
  });
});

function speciesFixture(overrides: Partial<Species> = {}): Species {
  return repositoryEntity({
    id: 1,
    definitionSlug: `species-${overrides.id ?? 1}`,
    name: 'Test Species',
    moisture: 'moist',
    light: 'bright-indirect',
    preferredTemperatureMin: 18,
    preferredTemperatureMax: 28,
    minimumTemperature: 12,
    growthPeriod: 'March-October',
    bloomPeriod: 'unknown',
    dormancyPeriod: 'November-February',
    growthFertilizer: 'balanced',
    bloomFertilizer: 'species-specific',
    dormancyFertilizer: 'none',
    notes: ['A useful observation.'],
    archived: false,
    sourceHash: (overrides.id ?? 1).toString().padEnd(64, '0'),
    ...overrides,
  });
}

function repositoryEntity(values: Species): Species {
  return values;
}

function plantFixture(overrides: Partial<Plant> = {}): Plant {
  return {
    nickname: 'Test plant',
    speciesId: 1,
    acquisitionDate: '2024-04-05',
    notes: null,
    status: 'active',
    locationId: null,
    ...overrides,
  } as Plant;
}

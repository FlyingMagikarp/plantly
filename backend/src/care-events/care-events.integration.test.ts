import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Server } from 'node:http';
import request from 'supertest';
import { GenericContainer, type StartedTestContainer, Wait } from 'testcontainers';
import { DataSource, Repository } from 'typeorm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { CreateSpecies1786449600000 } from '../database/migrations/1786449600000-CreateSpecies';
import { CreateLocations1786453200000 } from '../database/migrations/1786453200000-CreateLocations';
import { CreatePlants1786454626591 } from '../database/migrations/1786454626591-CreatePlants';
import { CreateCareEvents1786500000000 } from '../database/migrations/1786500000000-CreateCareEvents';
import { Location } from '../locations/location.entity';
import { Plant, type PlantStatus } from '../plants/plant.entity';
import { Species } from '../species/species.entity';
import { CareEvent } from './care-event.entity';
import { CareEventClock } from './care-events.service';
import { CareEventsModule } from './care-events.module';

const databaseName = 'plantly_care_events_tests';
const now = new Date('2026-08-13T10:00:00.000Z');

describe('UC-018: Record Observation', () => {
  let container: StartedTestContainer;
  let app: INestApplication;
  let dataSource: DataSource;
  let events: Repository<CareEvent>;
  let plants: Repository<Plant>;
  let species: Repository<Species>;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:18-alpine')
      .withEnvironment({
        POSTGRES_DB: databaseName,
        POSTGRES_USER: 'plantly_test',
        POSTGRES_PASSWORD: 'plantly_test',
      })
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forLogMessage(/database system is ready to accept connections/, 2))
      .withStartupTimeout(120_000)
      .start();
    const connection = {
      type: 'postgres' as const,
      host: container.getHost(),
      port: container.getMappedPort(5432),
      database: databaseName,
      username: 'plantly_test',
      password: 'plantly_test',
    };
    const entities = [Species, Location, Plant, CareEvent];
    const migrationSource = new DataSource({
      ...connection,
      entities,
      migrations: [
        CreateSpecies1786449600000,
        CreateLocations1786453200000,
        CreatePlants1786454626591,
        CreateCareEvents1786500000000,
      ],
      synchronize: false,
    });
    await migrationSource.initialize();
    await migrationSource.runMigrations();
    await migrationSource.destroy();

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({ ...connection, entities, synchronize: false }),
        CareEventsModule,
      ],
    })
      .overrideProvider(CareEventClock)
      .useValue({ now: () => now })
      .compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useLogger(false);
    await app.init();
    dataSource = app.get(DataSource);
    events = dataSource.getRepository(CareEvent);
    plants = dataSource.getRepository(Plant);
    species = dataSource.getRepository(Species);
  }, 120_000);

  beforeEach(async () => {
    await events.createQueryBuilder().delete().execute();
    await plants.createQueryBuilder().delete().execute();
    await species.createQueryBuilder().delete().execute();
    await saveSpecies();
  });

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  }, 30_000);

  it('records exactly one observation without notes for an active plant', async () => {
    const plant = await savePlant();

    const response = await postObservation(plant.id, {
      timestamp: '2026-08-13T09:30:00.000Z',
    });

    expect(response.status).toBe(201);
    const responseBody = response.body as unknown as {
      id: number;
      plantId: number;
      type: string;
      timestamp: string;
      notes: string | null;
    };
    expect(typeof responseBody.id).toBe('number');
    expect(responseBody).toMatchObject({
      plantId: plant.id,
      type: 'observation',
      timestamp: '2026-08-13T09:30:00.000Z',
      notes: null,
    });
    await expect(events.find()).resolves.toHaveLength(1);
  });

  it('stores optional notes on the selected plant observation', async () => {
    const plant = await savePlant();

    await postObservation(plant.id, {
      timestamp: '2026-08-12T07:15:00.000Z',
      notes: 'A new leaf is unfurling.',
    }).expect(201);

    await expect(events.findOneByOrFail({ plantId: plant.id })).resolves.toMatchObject({
      type: 'observation',
      notes: 'A new leaf is unfurling.',
    });
  });

  it.each(['dead', 'archived'] as PlantStatus[])(
    'rejects an observation for a %s plant without creating an event',
    async (status) => {
      const plant = await savePlant(status);

      const response = await postObservation(plant.id, {
        timestamp: '2026-08-13T09:30:00.000Z',
      });

      expect(response.status).toBe(409);
      expect(errorMessage(response)).toBe('Only active plants can receive care events');
      await expect(events.count()).resolves.toBe(0);
    },
  );

  it.each([
    ['future timestamp', { timestamp: '2026-08-13T10:00:00.001Z' }, 'Observation timestamp cannot be in the future'],
    ['invalid timestamp', { timestamp: 'not-a-time' }, 'A valid observation timestamp is required'],
    ['non-text notes', { timestamp: '2026-08-13T09:30:00.000Z', notes: 42 }, 'Observation notes must be text'],
  ])('rejects %s and identifies the invalid information without a partial event', async (_case, body, message) => {
    const plant = await savePlant();

    const response = await postObservation(plant.id, body);

    expect(response.status).toBe(400);
    expect(errorMessage(response)).toBe(message);
    await expect(events.count()).resolves.toBe(0);
  });

  it('reports a missing plant without recording an event for another plant', async () => {
    const existing = await savePlant();

    const response = await postObservation(existing.id + 1000, {
      timestamp: '2026-08-13T09:30:00.000Z',
    });

    expect(response.status).toBe(404);
    expect(errorMessage(response)).toBe('Plant not found');
    await expect(events.count()).resolves.toBe(0);
  });

  it('rolls back a persistence failure and allows one successful retry', async () => {
    const plant = await savePlant();
    await dataSource.query(`
      ALTER TABLE "care_events"
      ADD CONSTRAINT "CHK_test_reject_observation" CHECK ("notes" <> 'Retry this')
    `);
    try {
      const failed = await postObservation(plant.id, {
        timestamp: '2026-08-13T09:30:00.000Z',
        notes: 'Retry this',
      });
      expect(failed.status).toBe(500);
      await expect(events.count()).resolves.toBe(0);
    } finally {
      await dataSource.query('ALTER TABLE "care_events" DROP CONSTRAINT "CHK_test_reject_observation"');
    }

    await postObservation(plant.id, {
      timestamp: '2026-08-13T09:30:00.000Z',
      notes: 'Retry this',
    }).expect(201);
    await expect(events.count()).resolves.toBe(1);
  });

  function server(): Server {
    return app.getHttpServer() as Server;
  }

  function postObservation(plantId: number, body: object): request.Test {
    return request(server()).post(`/api/plants/${plantId}/care-events`).send(body);
  }

  function errorMessage(response: request.Response): string {
    return (response.body as unknown as { message: string }).message;
  }

  function savePlant(status: PlantStatus = 'active'): Promise<Plant> {
    return plants.save(plants.create({
      nickname: 'Observed plant',
      speciesId: 1,
      acquisitionDate: '2024-01-01',
      notes: null,
      status,
      locationId: null,
    }));
  }

  function saveSpecies(): Promise<Species> {
    return species.save(species.create({
      id: 1,
      definitionSlug: 'test-species',
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
      notes: [],
      archived: false,
      sourceHash: '1'.padEnd(64, '0'),
    }));
  }
});

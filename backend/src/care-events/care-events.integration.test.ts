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
import { CreatePlantImages1786510000000 } from '../database/migrations/1786510000000-CreatePlantImages';
import { CreateCareRounds1786520000000 } from '../database/migrations/1786520000000-CreateCareRounds';
import { CareRound } from '../care-rounds/care-round.entity';
import { CareRoundMember } from '../care-rounds/care-round-member.entity';
import { PlantImage } from '../images/plant-image.entity';
import { Location } from '../locations/location.entity';
import { Plant, type PlantStatus } from '../plants/plant.entity';
import { Species } from '../species/species.entity';
import { CareEvent } from './care-event.entity';
import { CareEventClock, type CareEventView } from './care-events.service';
import { CareEventsModule } from './care-events.module';

const databaseName = 'plantly_care_events_tests';
const now = new Date('2026-08-13T10:00:00.000Z');

describe('UC-014 through UC-021: Care Events', () => {
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
    const entities = [Species, Location, Plant, CareEvent, PlantImage, CareRound, CareRoundMember];
    const migrationSource = new DataSource({
      ...connection,
      entities,
      migrations: [
        CreateSpecies1786449600000,
        CreateLocations1786453200000,
        CreatePlants1786454626591,
        CreateCareEvents1786500000000,
        CreatePlantImages1786510000000,
        CreateCareRounds1786520000000,
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

  describe('UC-014 through UC-017: Record Typed Care Events', () => {
    it.each([
      ['watering', { fertilizerIncluded: false }],
      ['pruning', {}],
      ['repotting', {}],
      ['pest-treatment', {}],
    ])('records exactly one %s event without optional detail', async (type, extra) => {
      const plant = await savePlant();
      const response = await postEvent(plant.id, { type, timestamp: '2026-08-13T09:30:00.000Z', ...extra });
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({ plantId: plant.id, type, notes: null });
      await expect(events.countBy({ plantId: plant.id })).resolves.toBe(1);
    });

    it('keeps fertilisation on its watering event and stores optional notes', async () => {
      const plant = await savePlant();
      await postEvent(plant.id, { type: 'watering', timestamp: '2026-08-13T09:00:00.000Z', notes: 'Half strength', fertilizerIncluded: true }).expect(201);
      await expect(events.findOneByOrFail({ plantId: plant.id })).resolves.toMatchObject({ type: 'watering', notes: 'Half strength', fertilizerIncluded: true });
      await expect(events.count()).resolves.toBe(1);
    });

    it.each(['watering', 'pruning', 'repotting', 'pest-treatment'])(
      'rejects future and invalid data for %s without creating a partial event',
      async (type) => {
        const plant = await savePlant();
        await postEvent(plant.id, { type, timestamp: '2026-08-13T10:00:00.001Z' }).expect(400);
        await postEvent(plant.id, { type, timestamp: 'invalid', notes: 12 }).expect(400);
        await expect(events.count()).resolves.toBe(0);
      },
    );

    it('rejects fertilizer data on non-watering events', async () => {
      const plant = await savePlant();
      const response = await postEvent(plant.id, { type: 'pruning', timestamp: '2026-08-13T09:30:00.000Z', fertilizerIncluded: true });
      expect(response.status).toBe(400);
      expect(errorMessage(response)).toBe('Fertilizer information only belongs to watering events');
      await expect(events.count()).resolves.toBe(0);
    });
  });

  describe('UC-019: View Plant Care History', () => {
    it('returns only the selected plant events ordered by timestamp then descending identifier', async () => {
      const plant = await savePlant();
      const other = await savePlant();
      const older = await saveEvent(plant.id, 'pruning', '2026-08-10T08:00:00.000Z');
      const tiedLow = await saveEvent(plant.id, 'observation', '2026-08-12T08:00:00.000Z');
      const tiedHigh = await saveEvent(plant.id, 'watering', '2026-08-12T08:00:00.000Z', { fertilizerIncluded: true, notes: 'Fed' });
      await saveEvent(other.id, 'repotting', '2026-08-13T08:00:00.000Z');
      const response = await request(server()).get(`/api/plants/${plant.id}/care-events`).expect(200);
      expect((response.body as { items: CareEventView[] }).items.map((event) => event.id)).toEqual([tiedHigh.id, tiedLow.id, older.id]);
      expect((response.body as { items: CareEventView[] }).items[0]).toMatchObject({ fertilizerIncluded: true, notes: 'Fed' });
    });

    it('paginates by 10 and clamps an emptied or excessive page to the nearest available page', async () => {
      const plant = await savePlant();
      for (let index = 0; index < 11; index += 1) await saveEvent(plant.id, 'observation', `2026-08-${String(index + 1).padStart(2, '0')}T08:00:00.000Z`);
      const first = await request(server()).get(`/api/plants/${plant.id}/care-events?page=1`).expect(200);
      expect(first.body).toMatchObject({ page: 1, pageSize: 10, total: 11, totalPages: 2 });
      expect((first.body as { items: unknown[] }).items).toHaveLength(10);
      const last = await request(server()).get(`/api/plants/${plant.id}/care-events?page=99`).expect(200);
      expect(last.body).toMatchObject({ page: 2 });
      expect((last.body as { items: unknown[] }).items).toHaveLength(1);
    });

    it.each(['dead', 'archived'] as PlantStatus[])('retains history for a %s plant', async (status) => {
      const plant = await savePlant(status);
      await saveEvent(plant.id, 'observation', '2026-08-10T08:00:00.000Z');
      const response = await request(server()).get(`/api/plants/${plant.id}/care-events`).expect(200);
      expect((response.body as { items: unknown[] }).items).toHaveLength(1);
    });

    it('reports a missing plant and rejects invalid pages', async () => {
      await request(server()).get('/api/plants/999/care-events').expect(404);
      const plant = await savePlant();
      await request(server()).get(`/api/plants/${plant.id}/care-events?page=0`).expect(400);
    });
  });

  describe('UC-020: Correct Care Event', () => {
    it('corrects the same event without changing its type or plant or creating another event', async () => {
      const plant = await savePlant();
      const event = await saveEvent(plant.id, 'pruning', '2026-08-10T08:00:00.000Z', { notes: 'Old' });
      const response = await request(server()).patch(`/api/plants/${plant.id}/care-events/${event.id}`).send({ timestamp: '2026-08-11T08:00:00.000Z', notes: 'Corrected' }).expect(200);
      expect(response.body).toMatchObject({ id: event.id, plantId: plant.id, type: 'pruning', notes: 'Corrected' });
      await expect(events.count()).resolves.toBe(1);
    });

    it('accepts no changes without creating an event', async () => {
      const plant = await savePlant();
      const event = await saveEvent(plant.id, 'observation', '2026-08-10T08:00:00.000Z');
      await request(server()).patch(`/api/plants/${plant.id}/care-events/${event.id}`).send({ timestamp: '2026-08-10T08:00:00.000Z', notes: null }).expect(200);
      await expect(events.count()).resolves.toBe(1);
    });

    it.each(['dead', 'archived'] as PlantStatus[])('does not correct an event for a %s plant', async (status) => {
      const plant = await savePlant(status);
      const event = await saveEvent(plant.id, 'observation', '2026-08-10T08:00:00.000Z');
      await request(server()).patch(`/api/plants/${plant.id}/care-events/${event.id}`).send({ timestamp: '2026-08-09T08:00:00.000Z', notes: 'Changed' }).expect(409);
      await expect(events.findOneByOrFail({ id: event.id })).resolves.toMatchObject({ notes: null });
    });

    it('leaves stored values unchanged for invalid, missing, or wrong-plant corrections', async () => {
      const plant = await savePlant();
      const other = await savePlant();
      const event = await saveEvent(plant.id, 'observation', '2026-08-10T08:00:00.000Z', { notes: 'Original' });
      await request(server()).patch(`/api/plants/${plant.id}/care-events/${event.id}`).send({ timestamp: '2026-08-13T10:00:00.001Z', notes: 'Changed' }).expect(400);
      await request(server()).patch(`/api/plants/${other.id}/care-events/${event.id}`).send({ timestamp: '2026-08-09T08:00:00.000Z', notes: 'Changed' }).expect(404);
      await request(server()).patch(`/api/plants/999/care-events/${event.id}`).send({ timestamp: '2026-08-09T08:00:00.000Z', notes: 'Changed' }).expect(404);
      await expect(events.findOneByOrFail({ id: event.id })).resolves.toMatchObject({ notes: 'Original' });
    });
  });

  describe('UC-021: Remove Incorrect Care Event', () => {
    it('removes only the selected event from an active plant', async () => {
      const plant = await savePlant();
      const removed = await saveEvent(plant.id, 'observation', '2026-08-10T08:00:00.000Z');
      const retained = await saveEvent(plant.id, 'pruning', '2026-08-11T08:00:00.000Z');
      await request(server()).delete(`/api/plants/${plant.id}/care-events/${removed.id}`).expect(200, { removedEventId: removed.id });
      await expect(events.findOneBy({ id: removed.id })).resolves.toBeNull();
      await expect(events.findOneBy({ id: retained.id })).resolves.toBeTruthy();
    });

    it.each(['dead', 'archived'] as PlantStatus[])('does not remove an event for a %s plant', async (status) => {
      const plant = await savePlant(status);
      const event = await saveEvent(plant.id, 'observation', '2026-08-10T08:00:00.000Z');
      await request(server()).delete(`/api/plants/${plant.id}/care-events/${event.id}`).expect(409);
      await expect(events.findOneBy({ id: event.id })).resolves.toBeTruthy();
    });

    it('removes nothing for a missing plant, event, or wrong plant association', async () => {
      const plant = await savePlant();
      const other = await savePlant();
      const event = await saveEvent(plant.id, 'observation', '2026-08-10T08:00:00.000Z');
      await request(server()).delete(`/api/plants/${other.id}/care-events/${event.id}`).expect(404);
      await request(server()).delete(`/api/plants/999/care-events/${event.id}`).expect(404);
      await request(server()).delete(`/api/plants/${plant.id}/care-events/999`).expect(404);
      await expect(events.count()).resolves.toBe(1);
    });
  });

  function server(): Server {
    return app.getHttpServer() as Server;
  }

  function postObservation(plantId: number, body: object): request.Test {
    return request(server()).post(`/api/plants/${plantId}/care-events`).send(body);
  }

  function postEvent(plantId: number, body: object): request.Test {
    return request(server()).post(`/api/plants/${plantId}/care-events`).send(body);
  }

  function saveEvent(
    plantId: number,
    type: CareEvent['type'],
    timestamp: string,
    overrides: Partial<CareEvent> = {},
  ): Promise<CareEvent> {
    return events.save(events.create({ plantId, type, timestamp: new Date(timestamp), notes: null, fertilizerIncluded: type === 'watering' ? false : null, ...overrides }));
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

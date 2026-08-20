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
import { CreateCareEvents1786500000000 } from '../database/migrations/1786500000000-CreateCareEvents';
import { CreatePlantImages1786510000000 } from '../database/migrations/1786510000000-CreatePlantImages';
import { CreateCareRounds1786520000000 } from '../database/migrations/1786520000000-CreateCareRounds';
import { CareEvent } from '../care-events/care-event.entity';
import { CareRound } from '../care-rounds/care-round.entity';
import { CareRoundMember } from '../care-rounds/care-round-member.entity';
import { PlantImage } from '../images/plant-image.entity';
import { Location } from '../locations/location.entity';
import { LocationsModule } from '../locations/locations.module';
import { Species } from '../species/species.entity';
import { Plant, type PlantStatus } from './plant.entity';
import { PlantsModule } from './plants.module';
import { PlantClock, type PlantView } from './plants.service';

const postgresPort = 5432;
const databaseName = 'plantly_plants_tests';
const databaseUser = 'plantly_test';
const databasePassword = 'plantly_test';
const today = '2026-08-11';

describe('Plant API', () => {
  let container: StartedTestContainer;
  let app: INestApplication;
  let dataSource: DataSource;
  let plants: Repository<Plant>;
  let species: Repository<Species>;
  let locations: Repository<Location>;
  let careEvents: Repository<CareEvent>;

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
      entities: [Species, Location, Plant, CareEvent, PlantImage, CareRound, CareRoundMember],
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
    await migrationDataSource.initialize();
    await migrationDataSource.runMigrations();
    await migrationDataSource.destroy();

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          ...connection,
          entities: [Species, Location, Plant, CareEvent, PlantImage, CareRound, CareRoundMember],
          synchronize: false,
        }),
        PlantsModule,
        LocationsModule,
      ],
    })
      .overrideProvider(PlantClock)
      .useValue({ today: () => today })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useLogger(false);
    await app.init();
    dataSource = app.get(DataSource);
    plants = dataSource.getRepository(Plant);
    species = dataSource.getRepository(Species);
    locations = dataSource.getRepository(Location);
    careEvents = dataSource.getRepository(CareEvent);
  }, 120_000);

  beforeEach(async () => {
    await careEvents.createQueryBuilder().delete().execute();
    await plants.createQueryBuilder().delete().execute();
    await locations.createQueryBuilder().delete().execute();
    await species.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  }, 30_000);

  describe('UC-004: Add Plant to Collection', () => {
    it('adds sequential active plants with required values, optional notes, and duplicate nicknames', async () => {
      const hoya = await saveSpecies({ id: 1, name: 'Hoya linearis' });

      const first = await createPlant({
        nickname: 'Trailing Hoya',
        speciesId: hoya.id,
        acquisitionDate: today,
        notes: 'North-facing shelf.',
      });
      const second = await createPlant({
        nickname: 'Trailing Hoya',
        speciesId: hoya.id,
        acquisitionDate: '2024-03-10',
      });

      expect(first.status).toBe(201);
      expect(second.status).toBe(201);
      expect(first.body).toMatchObject({
        nickname: 'Trailing Hoya',
        acquisitionDate: today,
        notes: 'North-facing shelf.',
        status: 'active',
        species: { id: hoya.id, name: 'Hoya linearis', archived: false },
        location: null,
      });
      expect(second.body).toMatchObject({
        nickname: 'Trailing Hoya',
        acquisitionDate: '2024-03-10',
        notes: null,
        status: 'active',
      });
      expect((second.body as PlantView).id).toBeGreaterThan(
        (first.body as PlantView).id,
      );
      await expect(plants.count()).resolves.toBe(2);
    });

    it.each<[string, Record<string, unknown>]>([
      ['missing nickname', { speciesId: 1, acquisitionDate: today }],
      ['missing species', { nickname: 'Hoya', acquisitionDate: today }],
      ['missing acquisition date', { nickname: 'Hoya', speciesId: 1 }],
      [
        'future acquisition date',
        { nickname: 'Hoya', speciesId: 1, acquisitionDate: '2026-08-12' },
      ],
    ])('rejects %s and creates no plant', async (_case, body) => {
      await saveSpecies({ id: 1 });

      const response = await request(server()).post('/api/plants').send(body);

      expect(response.status).toBe(400);
      await expect(plants.count()).resolves.toBe(0);
    });

    it.each([
      ['archived', 2],
      ['missing', 999],
    ])('rejects an %s selected species without a partial plant', async (state, id) => {
      if (state === 'archived') {
        await saveSpecies({ id, archived: true });
      }

      const response = await createPlant({ speciesId: id });

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({ message: 'An active species is required' });
      await expect(plants.count()).resolves.toBe(0);
    });

    it('rolls back a persistence failure and allows the same valid addition to be retried', async () => {
      const hoya = await saveSpecies({ id: 1 });
      await dataSource.query(`
        ALTER TABLE "plants"
        ADD CONSTRAINT "CHK_test_reject_plant_create"
        CHECK ("nickname" <> 'Rejected plant')
      `);
      try {
        const failed = await createPlant({
          nickname: 'Rejected plant',
          speciesId: hoya.id,
        });

        expect(failed.status).toBe(500);
        await expect(plants.count()).resolves.toBe(0);
      } finally {
        await dataSource.query(`
          ALTER TABLE "plants" DROP CONSTRAINT "CHK_test_reject_plant_create"
        `);
      }

      expect(
        (await createPlant({ nickname: 'Rejected plant', speciesId: hoya.id }))
          .status,
      ).toBe(201);
      await expect(plants.count()).resolves.toBe(1);
    });
  });

  describe('UC-007: View Plant', () => {
    it('returns the selected plant with archived species, notes, status, and location', async () => {
      const fern = await saveSpecies({ id: 7, name: 'Archive Fern', archived: true });
      const shelf = await saveLocation('Window shelf');
      const plant = await savePlant({
        nickname: 'Selected fern',
        speciesId: fern.id,
        acquisitionDate: '2023-05-04',
        notes: 'Keep shaded.',
        status: 'archived',
        locationId: shelf.id,
      });

      const response = await request(server()).get(`/api/plants/${plant.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: plant.id,
        nickname: 'Selected fern',
        acquisitionDate: '2023-05-04',
        notes: 'Keep shaded.',
        status: 'archived',
        species: { id: fern.id, name: 'Archive Fern', archived: true },
        location: { id: shelf.id, name: 'Window shelf' },
      });
    });

    it('returns explicit null notes and location without modifying the plant', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const plant = await savePlant({ speciesId: hoya.id, notes: null, locationId: null });
      const before = await plants.findOneByOrFail({ id: plant.id });

      const response = await request(server()).get(`/api/plants/${plant.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ notes: null, location: null });
      await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toEqual(before);
    });

    it('returns 404 without another plant when the selected plant is missing', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const existing = await savePlant({ nickname: 'Existing', speciesId: hoya.id });

      const response = await request(server()).get(`/api/plants/${existing.id + 1000}`);

      expect(response.status).toBe(404);
      expect(response.body).not.toMatchObject({ nickname: 'Existing' });
    });
  });

  describe('UC-008: View Plant Collection', () => {
    it('returns every lifecycle status with species and optional location without modifying data', async () => {
      const hoya = await saveSpecies({ id: 1, name: 'Hoya' });
      const shelf = await saveLocation('Shelf');
      await savePlant({ nickname: 'Active', speciesId: hoya.id, locationId: shelf.id });
      await savePlant({ nickname: 'Dead', speciesId: hoya.id, status: 'dead' });
      await savePlant({ nickname: 'Archived', speciesId: hoya.id, status: 'archived' });
      const before = await plants.find({ order: { id: 'ASC' } });

      const response = await request(server()).get('/api/plants');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ nickname: 'Active', status: 'active', location: { id: shelf.id, name: 'Shelf' } }),
          expect.objectContaining({ nickname: 'Dead', status: 'dead', location: null }),
          expect.objectContaining({ nickname: 'Archived', status: 'archived', location: null }),
        ]),
      );
      await expect(plants.find({ order: { id: 'ASC' } })).resolves.toEqual(before);
    });
  });

  describe('UC-035: View Latest Care on Home', () => {
    it('returns the latest timestamp across event types and null without allowing inactive history to surface plants', async () => {
      const hoya = await saveSpecies({ id: 1, name: 'Hoya' });
      const active = await savePlant({ nickname: 'Active', speciesId: hoya.id });
      const uncared = await savePlant({ nickname: 'Uncared', speciesId: hoya.id });
      const dead = await savePlant({ nickname: 'Dead', speciesId: hoya.id, status: 'dead' });
      await careEvents.save([
        careEvents.create({ plantId: active.id, type: 'watering', timestamp: new Date('2026-08-10T08:00:00Z'), notes: null, fertilizerIncluded: false, roundId: null }),
        careEvents.create({ plantId: active.id, type: 'pruning', timestamp: new Date('2026-08-12T08:00:00Z'), notes: null, fertilizerIncluded: null, roundId: null }),
        careEvents.create({ plantId: dead.id, type: 'observation', timestamp: new Date('2026-08-20T08:00:00Z'), notes: null, fertilizerIncluded: null, roundId: null }),
      ]);

      const response = await request(server()).get('/api/plants').expect(200);
      const responseBody = response.body as unknown as PlantView[];

      expect(responseBody.find((plant) => plant.id === active.id)).toMatchObject({ latestCareTimestamp: '2026-08-12T08:00:00.000Z' });
      expect(responseBody.find((plant) => plant.id === uncared.id)).toMatchObject({ latestCareTimestamp: null });
      expect(responseBody.find((plant) => plant.id === dead.id)).toMatchObject({ status: 'dead', latestCareTimestamp: '2026-08-20T08:00:00.000Z' });
    });
  });

  describe('UC-005: Update Plant', () => {
    it('atomically changes all maintained fields, accepts a duplicate nickname and current date, and preserves identity and active status', async () => {
      const originalSpecies = await saveSpecies({ id: 1, name: 'Original' });
      const replacement = await saveSpecies({ id: 2, name: 'Replacement' });
      await savePlant({ nickname: 'Duplicate', speciesId: originalSpecies.id });
      const plant = await savePlant({
        nickname: 'Before',
        speciesId: originalSpecies.id,
        acquisitionDate: '2020-01-01',
        notes: 'Remove me',
      });

      const response = await updatePlant(plant.id, {
        nickname: 'Duplicate',
        speciesId: replacement.id,
        acquisitionDate: today,
        notes: '',
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: plant.id,
        nickname: 'Duplicate',
        acquisitionDate: today,
        notes: null,
        status: 'active',
        species: { id: replacement.id, name: 'Replacement' },
      });
    });

    it('retains an existing archived species while other fields change', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const plant = await savePlant({ speciesId: hoya.id });
      hoya.archived = true;
      await species.save(hoya);

      const response = await updatePlant(plant.id, {
        nickname: 'Updated with archived species',
        speciesId: hoya.id,
        acquisitionDate: '2024-01-01',
        notes: 'Still associated.',
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        nickname: 'Updated with archived species',
        species: { id: hoya.id, archived: true },
      });
    });

    it.each([
      ['archived replacement', 2],
      ['missing replacement', 999],
    ])('rejects an %s and preserves every stored field', async (state, replacementId) => {
      const original = await saveSpecies({ id: 1 });
      if (state === 'archived replacement') {
        await saveSpecies({ id: replacementId, archived: true });
      }
      const plant = await savePlant({ speciesId: original.id, notes: 'Original note' });
      const before = await plants.findOneByOrFail({ id: plant.id });

      const response = await updatePlant(plant.id, {
        nickname: 'Changed',
        speciesId: replacementId,
        acquisitionDate: '2024-01-01',
        notes: 'Changed note',
      });

      expect(response.status).toBe(409);
      await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toEqual(before);
    });

    it.each([
      ['missing nickname', { nickname: '', acquisitionDate: '2024-01-01' }],
      ['missing species', { speciesId: undefined, acquisitionDate: '2024-01-01' }],
      ['missing date', { acquisitionDate: '' }],
      ['future date', { acquisitionDate: '2026-08-12' }],
    ])('rejects %s and preserves every stored field', async (_case, override) => {
      const hoya = await saveSpecies({ id: 1 });
      const plant = await savePlant({ speciesId: hoya.id, notes: 'Original' });
      const before = await plants.findOneByOrFail({ id: plant.id });

      const response = await updatePlant(plant.id, Object.assign({
        nickname: 'Changed',
        speciesId: hoya.id,
        acquisitionDate: '2024-01-01',
        notes: 'Changed',
      }, override));

      expect(response.status).toBe(400);
      await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toEqual(before);
    });

    it.each(['dead', 'archived'] as PlantStatus[])(
      'rejects maintained-field updates for a %s plant',
      async (status) => {
        const hoya = await saveSpecies({ id: 1 });
        const plant = await savePlant({ speciesId: hoya.id, status });
        const before = await plants.findOneByOrFail({ id: plant.id });

        const response = await updatePlant(plant.id, {
          nickname: 'Changed',
          speciesId: hoya.id,
          acquisitionDate: '2024-01-01',
          notes: null,
        });

        expect(response.status).toBe(409);
        await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toEqual(before);
      },
    );

    it('returns 404 without changing another plant when the selected plant is missing', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const existing = await savePlant({ speciesId: hoya.id });
      const before = await plants.findOneByOrFail({ id: existing.id });

      const response = await updatePlant(existing.id + 1000, {
        nickname: 'Changed',
        speciesId: hoya.id,
        acquisitionDate: today,
        notes: null,
      });

      expect(response.status).toBe(404);
      await expect(plants.findOneByOrFail({ id: existing.id })).resolves.toEqual(before);
    });

    it('rolls back a persistence failure and allows retry without losing entered intent', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const plant = await savePlant({ nickname: 'Before', speciesId: hoya.id });
      await dataSource.query(`
        ALTER TABLE "plants"
        ADD CONSTRAINT "CHK_test_reject_plant_update"
        CHECK ("nickname" <> 'Rejected update')
      `);
      try {
        const failed = await updatePlant(plant.id, {
          nickname: 'Rejected update',
          speciesId: hoya.id,
          acquisitionDate: today,
          notes: 'Entered note',
        });

        expect(failed.status).toBe(500);
        await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toMatchObject({ nickname: 'Before', notes: null });
      } finally {
        await dataSource.query(`
          ALTER TABLE "plants" DROP CONSTRAINT "CHK_test_reject_plant_update"
        `);
      }

      expect(
        (
          await updatePlant(plant.id, {
            nickname: 'Rejected update',
            speciesId: hoya.id,
            acquisitionDate: today,
            notes: 'Entered note',
          })
        ).status,
      ).toBe(200);
    });
  });

  describe('UC-006: Remove Plant from Collection', () => {
    it.each(['dead', 'archived'] as PlantStatus[])(
      'changes an active plant to %s while preserving all other plant data, then restores it',
      async (status) => {
        const hoya = await saveSpecies({ id: 1 });
        const shelf = await saveLocation('Shelf');
        const plant = await savePlant({
          nickname: 'Preserved',
          speciesId: hoya.id,
          acquisitionDate: '2022-02-02',
          notes: 'Keep this',
          locationId: shelf.id,
        });

        const changed = await updateStatus(plant.id, status);
        const restored = await updateStatus(plant.id, 'active');

        expect(changed.status).toBe(200);
        expect(changed.body).toMatchObject({
          id: plant.id,
          nickname: 'Preserved',
          acquisitionDate: '2022-02-02',
          notes: 'Keep this',
          status,
          species: { id: hoya.id },
          location: { id: shelf.id },
        });
        expect(restored.status).toBe(200);
        expect(restored.body).toMatchObject({
          id: plant.id,
          nickname: 'Preserved',
          status: 'active',
          notes: 'Keep this',
          location: { id: shelf.id },
        });
      },
    );

    it.each([
      ['dead', 'dead'],
      ['dead', 'archived'],
      ['archived', 'archived'],
      ['archived', 'dead'],
    ] as Array<[PlantStatus, PlantStatus]>)(
      'rejects changing a %s plant directly to %s',
      async (current, requested) => {
        const hoya = await saveSpecies({ id: 1 });
        const plant = await savePlant({ speciesId: hoya.id, status: current });

        const response = await updateStatus(plant.id, requested);

        expect(response.status).toBe(409);
        await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toMatchObject({ status: current });
      },
    );

    it.each(['active', 'dead', 'archived'] as PlantStatus[])(
      'permanently deletes a plant with %s status',
      async (status) => {
        const hoya = await saveSpecies({ id: 1 });
        const plant = await savePlant({ speciesId: hoya.id, status });

        const response = await request(server()).delete(`/api/plants/${plant.id}`);

        expect(response.status).toBe(204);
        await expect(plants.findOneBy({ id: plant.id })).resolves.toBeNull();
        await request(server()).get(`/api/plants/${plant.id}`).expect(404);
      },
    );

    it('reports missing status and delete targets without affecting another plant', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const existing = await savePlant({ speciesId: hoya.id });
      const missingId = existing.id + 1000;

      expect((await updateStatus(missingId, 'dead')).status).toBe(404);
      expect((await request(server()).delete(`/api/plants/${missingId}`)).status).toBe(404);
      await expect(plants.findOneByOrFail({ id: existing.id })).resolves.toMatchObject({ status: 'active' });
    });

    it('rolls back failed status changes and failed permanent deletion', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const plant = await savePlant({ nickname: 'Protected', speciesId: hoya.id });
      await dataSource.query(`
        CREATE FUNCTION "reject_test_plant_mutation"() RETURNS trigger AS $$
        BEGIN
          RAISE EXCEPTION 'rejected plant mutation';
        END;
        $$ LANGUAGE plpgsql
      `);
      try {
        await dataSource.query(`
          CREATE TRIGGER "TRG_test_reject_plant_status"
          BEFORE UPDATE OF "status" ON "plants"
          FOR EACH ROW EXECUTE FUNCTION "reject_test_plant_mutation"()
        `);
        expect((await updateStatus(plant.id, 'dead')).status).toBe(500);
        await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toMatchObject({ status: 'active' });
        await dataSource.query('DROP TRIGGER "TRG_test_reject_plant_status" ON "plants"');

        await dataSource.query(`
          CREATE TRIGGER "TRG_test_reject_plant_delete"
          BEFORE DELETE ON "plants"
          FOR EACH ROW EXECUTE FUNCTION "reject_test_plant_mutation"()
        `);
        expect((await request(server()).delete(`/api/plants/${plant.id}`)).status).toBe(500);
        await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toMatchObject({ nickname: 'Protected' });
        await dataSource.query('DROP TRIGGER "TRG_test_reject_plant_delete" ON "plants"');
      } finally {
        await dataSource.query('DROP TRIGGER IF EXISTS "TRG_test_reject_plant_status" ON "plants"');
        await dataSource.query('DROP TRIGGER IF EXISTS "TRG_test_reject_plant_delete" ON "plants"');
        await dataSource.query('DROP FUNCTION "reject_test_plant_mutation"()');
      }
    });
  });

  describe('UC-012: Assign Plant to Location', () => {
    it('assigns, keeps the same assignment, moves, and makes an active plant unassigned', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const balcony = await saveLocation('Balcony');
      const kitchen = await saveLocation('Kitchen');
      const plant = await savePlant({ speciesId: hoya.id });

      const assigned = await updateLocation(plant.id, balcony.id);
      const same = await updateLocation(plant.id, balcony.id);
      const moved = await updateLocation(plant.id, kitchen.id);
      const unassigned = await updateLocation(plant.id, null);

      expect((assigned.body as PlantView).location).toEqual({ id: balcony.id, name: 'Balcony' });
      expect((same.body as PlantView).location).toEqual({ id: balcony.id, name: 'Balcony' });
      expect((moved.body as PlantView).location).toEqual({ id: kitchen.id, name: 'Kitchen' });
      expect((unassigned.body as PlantView).location).toBeNull();
      await expect(plants.count()).resolves.toBe(1);
    });

    it.each(['dead', 'archived'] as PlantStatus[])(
      'retains location but rejects assignment changes for a %s plant',
      async (status) => {
        const hoya = await saveSpecies({ id: 1 });
        const shelf = await saveLocation('Shelf');
        const other = await saveLocation('Other');
        const plant = await savePlant({ speciesId: hoya.id, status, locationId: shelf.id });

        const response = await updateLocation(plant.id, other.id);

        expect(response.status).toBe(409);
        await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toMatchObject({ locationId: shelf.id, status });
      },
    );

    it('preserves assignment when the selected location is missing', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const shelf = await saveLocation('Shelf');
      const plant = await savePlant({ speciesId: hoya.id, locationId: shelf.id });

      const response = await updateLocation(plant.id, shelf.id + 1000);

      expect(response.status).toBe(404);
      await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toMatchObject({ locationId: shelf.id });
    });

    it('reports a missing plant without modifying another plant', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const shelf = await saveLocation('Shelf');
      const existing = await savePlant({ speciesId: hoya.id });

      const response = await updateLocation(existing.id + 1000, shelf.id);

      expect(response.status).toBe(404);
      await expect(plants.findOneByOrFail({ id: existing.id })).resolves.toMatchObject({ locationId: null });
    });

    it('rolls back a failed assignment and keeps the previous location', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const shelf = await saveLocation('Shelf');
      const other = await saveLocation('Other');
      const plant = await savePlant({ speciesId: hoya.id, locationId: shelf.id });
      await dataSource.query(`
        ALTER TABLE "plants"
        ADD CONSTRAINT "CHK_test_reject_plant_location"
        CHECK ("location_id" <> ${other.id})
      `);
      try {
        const response = await updateLocation(plant.id, other.id);

        expect(response.status).toBe(500);
        await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toMatchObject({ locationId: shelf.id });
      } finally {
        await dataSource.query(`
          ALTER TABLE "plants" DROP CONSTRAINT "CHK_test_reject_plant_location"
        `);
      }
    });
  });

  describe('UC-013: View Plants by Location', () => {
    it('makes an assigned plant unassigned when its location is removed without changing other fields', async () => {
      const hoya = await saveSpecies({ id: 1 });
      const shelf = await saveLocation('Temporary shelf');
      const plant = await savePlant({
        nickname: 'Moved by deletion',
        speciesId: hoya.id,
        notes: 'Preserved',
        locationId: shelf.id,
      });

      const response = await request(server()).delete(`/api/locations/${shelf.id}`);

      expect(response.status).toBe(204);
      await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toMatchObject({
        nickname: 'Moved by deletion',
        notes: 'Preserved',
        status: 'active',
        locationId: null,
      });
    });
  });

  function server(): Server {
    return app.getHttpServer() as Server;
  }

  function createPlant(
    overrides: Record<string, unknown> = {},
  ): Promise<request.Response> {
    return request(server())
      .post('/api/plants')
      .send({
        nickname: 'Test plant',
        speciesId: 1,
        acquisitionDate: '2024-04-05',
        ...overrides,
      });
  }

  function updatePlant(
    id: number,
    body: Record<string, unknown>,
  ): Promise<request.Response> {
    return request(server()).patch(`/api/plants/${id}`).send(body);
  }

  function updateStatus(
    id: number,
    status: PlantStatus,
  ): Promise<request.Response> {
    return request(server()).patch(`/api/plants/${id}/status`).send({ status });
  }

  function updateLocation(
    id: number,
    locationId: number | null,
  ): Promise<request.Response> {
    return request(server())
      .patch(`/api/plants/${id}/location`)
      .send({ locationId });
  }

  function saveSpecies(overrides: Partial<Species> = {}): Promise<Species> {
    const id = overrides.id ?? 1;
    return species.save(
      species.create({
        id,
        definitionSlug: `species-${id}`,
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
        sourceHash: id.toString().padEnd(64, '0'),
        ...overrides,
      }),
    );
  }

  function saveLocation(name: string): Promise<Location> {
    return locations.save(locations.create({ name }));
  }

  function savePlant(overrides: Partial<Plant> = {}): Promise<Plant> {
    return plants.save(
      plants.create({
        nickname: 'Test plant',
        speciesId: 1,
        acquisitionDate: '2024-04-05',
        notes: null,
        status: 'active',
        locationId: null,
        ...overrides,
      }),
    );
  }
});

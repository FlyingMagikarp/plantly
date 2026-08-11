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
import { Plant, type PlantStatus } from '../plants/plant.entity';
import { Species } from '../species/species.entity';
import { Location } from './location.entity';
import { LocationsModule } from './locations.module';

const postgresPort = 5432;
const databaseName = 'plantly_locations_tests';
const databaseUser = 'plantly_test';
const databasePassword = 'plantly_test';

describe('Location API', () => {
  let container: StartedTestContainer;
  let app: INestApplication;
  let dataSource: DataSource;
  let repository: Repository<Location>;
  let plants: Repository<Plant>;
  let species: Repository<Species>;

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
        LocationsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useLogger(false);
    await app.init();
    dataSource = app.get(DataSource);
    repository = dataSource.getRepository(Location);
    plants = dataSource.getRepository(Plant);
    species = dataSource.getRepository(Species);
  }, 120_000);

  beforeEach(async () => {
    await plants.createQueryBuilder().delete().execute();
    await repository.createQueryBuilder().delete().execute();
    await species.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  }, 30_000);

  describe('UC-009: Create Location', () => {
    it('creates exactly one location with a system-assigned identifier', async () => {
      const response = await createLocation('Balcony');
      const created = response.body as unknown as Location;

      expect(response.status).toBe(201);
      expect(typeof created.id).toBe('number');
      expect(created.name).toBe('Balcony');
      await expect(repository.find()).resolves.toEqual([created]);
    });

    it('removes trailing whitespace before storing the name', async () => {
      const response = await createLocation('Balcony  \t\n');
      const created = response.body as unknown as Location;

      expect(response.status).toBe(201);
      expect(created).toMatchObject({ name: 'Balcony' });
      await expect(repository.findOneByOrFail({ id: created.id }))
        .resolves.toMatchObject({ name: 'Balcony' });
    });

    it.each(['balcony', 'BALCONY'])(
      'rejects case-insensitive duplicate name %s without creating a location',
      async (duplicateName) => {
        await repository.save(repository.create({ name: 'Balcony' }));

        const response = await createLocation(duplicateName);

        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
          message: 'Location name is already used',
        });
        await expect(repository.count()).resolves.toBe(1);
      },
    );

    it('rejects a duplicate after removing trailing whitespace', async () => {
      await repository.save(repository.create({ name: 'Balcony' }));

      const response = await createLocation('Balcony   ');

      expect(response.status).toBe(409);
      await expect(repository.find()).resolves.toMatchObject([
        { name: 'Balcony' },
      ]);
    });

    it.each([
      ['a missing name', {}],
      ['an empty name', { name: '' }],
      ['a whitespace-only name', { name: '  \t\n' }],
    ])('rejects %s and leaves the location set unchanged', async (_case, body) => {
      const response = await request(app.getHttpServer() as Server)
        .post('/api/locations')
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ message: 'Location name is required' });
      await expect(repository.count()).resolves.toBe(0);
    });

    it('reports a persistence failure without a partial row and allows retry', async () => {
      await dataSource.query(`
        ALTER TABLE "locations"
        ADD CONSTRAINT "CHK_test_reject_location_create"
        CHECK ("name" <> 'Rejected location')
      `);
      try {
        const failed = await createLocation('Rejected location');

        expect(failed.status).toBe(500);
        await expect(repository.count()).resolves.toBe(0);
      } finally {
        await dataSource.query(`
          ALTER TABLE "locations"
          DROP CONSTRAINT "CHK_test_reject_location_create"
        `);
      }

      const retried = await createLocation('Rejected location');
      expect(retried.status).toBe(201);
      await expect(repository.count()).resolves.toBe(1);
    });
  });

  describe('UC-010: Update Location', () => {
    it('renames a location while retaining its technical identifier', async () => {
      const location = await saveLocation('Balcony');
      const speciesRecord = await saveSpecies();
      const plant = await savePlant(speciesRecord.id, location.id, 'active');

      const response = await updateLocation(location.id, 'Sunroom');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: location.id, name: 'Sunroom' });
      await expect(repository.find()).resolves.toMatchObject([
        { id: location.id, name: 'Sunroom' },
      ]);
      await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toMatchObject({
        locationId: location.id,
      });
    });

    it('removes trailing whitespace before storing a renamed location', async () => {
      const location = await saveLocation('Balcony');

      const response = await updateLocation(location.id, 'Sunroom   \t');

      expect(response.status).toBe(200);
      await expect(repository.findOneByOrFail({ id: location.id }))
        .resolves.toMatchObject({ name: 'Sunroom' });
    });

    it('allows a capitalization-only rename of the selected location', async () => {
      const location = await saveLocation('Balcony');

      const response = await updateLocation(location.id, 'balcony');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: location.id, name: 'balcony' });
    });

    it.each(['kitchen', 'Kitchen   '])(
      'rejects conflicting name %s and preserves both locations',
      async (duplicateName) => {
        const balcony = await saveLocation('Balcony');
        const kitchen = await saveLocation('Kitchen');
        const before = await orderedLocations();

        const response = await updateLocation(balcony.id, duplicateName);

        expect(response.status).toBe(409);
        expect(await orderedLocations()).toEqual(before);
        expect(await repository.findOneByOrFail({ id: kitchen.id })).toMatchObject({
          name: 'Kitchen',
        });
      },
    );

    it('rejects an empty cleaned name and preserves the stored location', async () => {
      const location = await saveLocation('Balcony');

      const response = await updateLocation(location.id, '  \t');

      expect(response.status).toBe(400);
      await expect(repository.findOneByOrFail({ id: location.id }))
        .resolves.toMatchObject({ name: 'Balcony' });
    });

    it('reports a missing location without modifying another location', async () => {
      const existing = await saveLocation('Kitchen');
      const before = await orderedLocations();

      const response = await updateLocation(existing.id + 10_000, 'Office');

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ message: 'Location not found' });
      expect(await orderedLocations()).toEqual(before);
    });

    it('reports a persistence failure and preserves name and identifier', async () => {
      const location = await saveLocation('Balcony');
      await dataSource.query(`
        ALTER TABLE "locations"
        ADD CONSTRAINT "CHK_test_reject_location_update"
        CHECK ("name" <> 'Rejected rename')
      `);
      try {
        const response = await updateLocation(location.id, 'Rejected rename');

        expect(response.status).toBe(500);
        await expect(repository.find()).resolves.toMatchObject([
          { id: location.id, name: 'Balcony' },
        ]);
      } finally {
        await dataSource.query(`
          ALTER TABLE "locations"
          DROP CONSTRAINT "CHK_test_reject_location_update"
        `);
      }
    });
  });

  describe('UC-011: Remove Location', () => {
    it('permanently deletes a location that has no assigned plants', async () => {
      const location = await saveLocation('Balcony');

      const response = await removeLocation(location.id);

      expect(response.status).toBe(204);
      expect(response.text).toBe('');
      await expect(repository.count()).resolves.toBe(0);
    });

    it.each(['active', 'dead', 'archived'] as PlantStatus[])(
      'unassigns a %s plant without changing its lifecycle or other data',
      async (status) => {
        const location = await saveLocation('Balcony');
        const speciesRecord = await saveSpecies();
        const plant = await savePlant(speciesRecord.id, location.id, status);

        const response = await removeLocation(location.id);

        expect(response.status).toBe(204);
        await expect(plants.findOneByOrFail({ id: plant.id })).resolves.toMatchObject({
          nickname: 'Preserved plant',
          speciesId: speciesRecord.id,
          acquisitionDate: '2024-04-05',
          notes: 'Preserved notes',
          status,
          locationId: null,
        });
      },
    );

    it('reports a missing location without deleting another location', async () => {
      const existing = await saveLocation('Kitchen');
      const before = await orderedLocations();

      const response = await removeLocation(existing.id + 10_000);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ message: 'Location not found' });
      expect(await orderedLocations()).toEqual(before);
    });

    it('reports a deletion failure and leaves the location unchanged', async () => {
      const location = await saveLocation('Balcony');
      await dataSource.query(`
        CREATE FUNCTION "reject_test_location_delete"() RETURNS trigger AS $$
        BEGIN
          RAISE EXCEPTION 'rejected test deletion';
        END;
        $$ LANGUAGE plpgsql
      `);
      await dataSource.query(`
        CREATE TRIGGER "TRG_test_reject_location_delete"
        BEFORE DELETE ON "locations"
        FOR EACH ROW EXECUTE FUNCTION "reject_test_location_delete"()
      `);
      try {
        const response = await removeLocation(location.id);

        expect(response.status).toBe(500);
        await expect(repository.find()).resolves.toMatchObject([
          { id: location.id, name: 'Balcony' },
        ]);
      } finally {
        await dataSource.query(
          'DROP TRIGGER "TRG_test_reject_location_delete" ON "locations"',
        );
        await dataSource.query('DROP FUNCTION "reject_test_location_delete"()');
      }
    });
  });

  function createLocation(name: string): Promise<request.Response> {
    return request(app.getHttpServer() as Server)
      .post('/api/locations')
      .send({ name });
  }

  function updateLocation(
    id: number,
    name: string,
  ): Promise<request.Response> {
    return request(app.getHttpServer() as Server)
      .patch(`/api/locations/${id}`)
      .send({ name });
  }

  function removeLocation(id: number): Promise<request.Response> {
    return request(app.getHttpServer() as Server).delete(
      `/api/locations/${id}`,
    );
  }

  function saveLocation(name: string): Promise<Location> {
    return repository.save(repository.create({ name }));
  }

  function orderedLocations(): Promise<Location[]> {
    return repository.find({ order: { id: 'ASC' } });
  }

  function saveSpecies(): Promise<Species> {
    return species.save(
      species.create({
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
      }),
    );
  }

  function savePlant(
    speciesId: number,
    locationId: number,
    status: PlantStatus,
  ): Promise<Plant> {
    return plants.save(
      plants.create({
        nickname: 'Preserved plant',
        speciesId,
        acquisitionDate: '2024-04-05',
        notes: 'Preserved notes',
        status,
        locationId,
      }),
    );
  }
});

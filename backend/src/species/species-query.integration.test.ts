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
      entities: [Species],
      migrations: [CreateSpecies1786449600000],
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
          entities: [Species],
          synchronize: false,
        }),
        SpeciesModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useLogger(false);
    await app.init();
    repository = app.get(DataSource).getRepository(Species);
  }, 120_000);

  beforeEach(async () => {
    await repository.clear();
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

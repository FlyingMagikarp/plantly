import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mkdir, readdir, rm, unlink, writeFile } from 'node:fs/promises';
import type { Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
import { SpeciesDefinitionsDirectory } from './species.service';

interface DefinitionOptions {
  name: string;
  moisture: string;
  light: string;
  temperature: string;
  minimumTemperature: string;
  growthPeriod: string;
  bloomPeriod: string;
  dormancyPeriod: string;
  growthFertilizer: string;
  bloomFertilizer: string;
  dormancyFertilizer: string;
  notes: string[];
}

const postgresPort = 5432;
const databaseName = 'plantly_uc001_tests';
const databaseUser = 'plantly_test';
const databasePassword = 'plantly_test';

describe('UC-001: Synchronize Species Definitions', () => {
  let container: StartedTestContainer;
  let definitionsDirectory: string;
  let app: INestApplication;
  let dataSource: DataSource;
  let repository: Repository<Species>;
  let plants: Repository<Plant>;

  beforeAll(async () => {
    definitionsDirectory = join(
      tmpdir(),
      `plantly-uc001-${process.pid}-${Date.now()}`,
    );
    await mkdir(definitionsDirectory, { recursive: true });

    container = await new GenericContainer('postgres:18-alpine')
      .withEnvironment({
        POSTGRES_DB: databaseName,
        POSTGRES_USER: databaseUser,
        POSTGRES_PASSWORD: databasePassword,
      })
      .withExposedPorts(postgresPort)
      .withWaitStrategy(
        Wait.forLogMessage(
          /database system is ready to accept connections/,
          2,
        ),
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
    })
      .overrideProvider(SpeciesDefinitionsDirectory)
      .useValue(new SpeciesDefinitionsDirectory(definitionsDirectory))
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useLogger(false);
    await app.init();
    dataSource = app.get(DataSource);
    repository = dataSource.getRepository(Species);
    plants = dataSource.getRepository(Plant);
  }, 120_000);

  beforeEach(async () => {
    await plants.createQueryBuilder().delete().execute();
    await repository.createQueryBuilder().delete().execute();
    await clearDefinitions(definitionsDirectory);
  });

  afterAll(async () => {
    await app?.close();
    await container?.stop();
    if (definitionsDirectory) {
      await rm(definitionsDirectory, { recursive: true, force: true });
    }
  }, 30_000);

  it('creates a species from a valid filename and returns 204 with no body', async () => {
    await writeDefinition(
      definitionsDirectory,
      'SP-001-hoya-linearis.md',
      definition({
        name: 'Hoya Linearis',
        moisture: 'slightly-dry',
        temperature: '15-29 °C',
        minimumTemperature: '10 °C',
      }),
    );

    const response = await synchronize(app);

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
    await expect(repository.find()).resolves.toMatchObject([
      {
        id: 1,
        definitionSlug: 'hoya-linearis',
        name: 'Hoya Linearis',
        moisture: 'slightly-dry',
        light: 'bright-indirect',
        preferredTemperatureMin: 15,
        preferredTemperatureMax: 29,
        minimumTemperature: 10,
        archived: false,
      },
    ]);
  });

  it('ignores README.md and TEMPLATE.md while synchronizing valid definitions', async () => {
    await writeDefinition(definitionsDirectory, 'README.md', 'not a definition');
    await writeDefinition(definitionsDirectory, 'TEMPLATE.md', '# <placeholder>');
    await writeDefinition(
      definitionsDirectory,
      'SP-010-valid-species.md',
      definition({ name: 'Valid Species' }),
    );

    const response = await synchronize(app);

    expect(response.status).toBe(204);
    await expect(repository.find()).resolves.toMatchObject([
      { id: 10, definitionSlug: 'valid-species', archived: false },
    ]);
  });

  it('returns bodyless 422 for an invalid filename and preserves runtime data', async () => {
    await writeDefinition(
      definitionsDirectory,
      'SP-001-original.md',
      definition({ name: 'Original' }),
    );
    expect((await synchronize(app)).status).toBe(204);
    const before = await repository.find();
    await writeDefinition(definitionsDirectory, 'invalid.md', definition());

    const response = await synchronize(app);

    expect(response.status).toBe(422);
    expect(response.text).toBe('');
    expect(await repository.find()).toEqual(before);
  });

  it('rejects an invalid definition before applying otherwise valid changes', async () => {
    await writeDefinition(
      definitionsDirectory,
      'SP-001-original.md',
      definition({ name: 'Original', moisture: 'dry' }),
    );
    expect((await synchronize(app)).status).toBe(204);
    const before = await repository.find();

    await writeDefinition(
      definitionsDirectory,
      'SP-001-original.md',
      definition({ name: 'Changed', moisture: 'wet' }),
    );
    await writeDefinition(
      definitionsDirectory,
      'SP-002-invalid.md',
      definition({ name: 'Invalid' }).replace('Moisture: moist\n', ''),
    );

    const response = await synchronize(app);

    expect(response.status).toBe(422);
    expect(response.text).toBe('');
    expect(await repository.find()).toEqual(before);
  });

  it.each([
    [
      'numeric identifier',
      [
        ['SP-010-first.md', 'First'],
        ['SP-010-second.md', 'Second'],
      ],
    ],
    [
      'filename species identity',
      [
        ['SP-010-same-species.md', 'Same Species'],
        ['SP-011-same-species.md', 'Same Species'],
      ],
    ],
  ])('rejects definitions with a duplicate %s', async (_description, files) => {
    for (const [filename, name] of files) {
      await writeDefinition(
        definitionsDirectory,
        filename,
        definition({ name }),
      );
    }

    const response = await synchronize(app);

    expect(response.status).toBe(422);
    expect(response.text).toBe('');
    await expect(repository.count()).resolves.toBe(0);
  });

  it.each(['active', 'archived']) (
    'rejects reuse of an identifier belonging to an %s species',
    async (state) => {
      await writeDefinition(
        definitionsDirectory,
        'SP-020-original-species.md',
        definition({ name: 'Original Species' }),
      );
      expect((await synchronize(app)).status).toBe(204);
      await unlink(join(definitionsDirectory, 'SP-020-original-species.md'));
      if (state === 'archived') {
        expect((await synchronize(app)).status).toBe(204);
      }
      const before = await repository.find();
      await writeDefinition(
        definitionsDirectory,
        'SP-020-different-species.md',
        definition({ name: 'Different Species' }),
      );

      const response = await synchronize(app);

      expect(response.status).toBe(422);
      expect(response.text).toBe('');
      expect(await repository.find()).toEqual(before);
    },
  );

  it('updates changed data and does not rewrite a semantically unchanged species', async () => {
    const filename = 'SP-030-changing-species.md';
    await writeDefinition(
      definitionsDirectory,
      filename,
      definition({ name: 'Changing Species', moisture: 'dry' }),
    );
    expect((await synchronize(app)).status).toBe(204);
    const originalVersion = await rowVersion(dataSource, 30);

    await writeDefinition(
      definitionsDirectory,
      filename,
      definition({ name: 'Changed Species', moisture: 'wet' }),
    );
    expect((await synchronize(app)).status).toBe(204);
    const changed = await repository.findOneByOrFail({ id: 30 });
    const changedVersion = await rowVersion(dataSource, 30);
    expect(changed).toMatchObject({
      name: 'Changed Species',
      moisture: 'wet',
      archived: false,
    });
    expect(changedVersion).not.toBe(originalVersion);

    expect((await synchronize(app)).status).toBe(204);
    expect(await rowVersion(dataSource, 30)).toBe(changedVersion);
  });

  it('archives a removed definition and reactivates the same updated species without duplication', async () => {
    const filename = 'SP-040-restorable-species.md';
    await writeDefinition(
      definitionsDirectory,
      filename,
      definition({ name: 'Restorable Species', moisture: 'dry' }),
    );
    expect((await synchronize(app)).status).toBe(204);
    const associatedPlant = await plants.save(
      plants.create({
        nickname: 'Existing plant',
        speciesId: 40,
        acquisitionDate: '2024-04-05',
        notes: null,
        status: 'active',
        locationId: null,
      }),
    );

    await unlink(join(definitionsDirectory, filename));
    expect((await synchronize(app)).status).toBe(204);
    await expect(repository.findOneByOrFail({ id: 40 })).resolves.toMatchObject({
      archived: true,
    });
    await expect(plants.findOneByOrFail({ id: associatedPlant.id })).resolves.toMatchObject({
      speciesId: 40,
    });

    await writeDefinition(
      definitionsDirectory,
      filename,
      definition({ name: 'Restored Species', moisture: 'moist' }),
    );
    expect((await synchronize(app)).status).toBe(204);

    expect(await repository.count()).toBe(1);
    await expect(repository.findOneByOrFail({ id: 40 })).resolves.toMatchObject({
      name: 'Restored Species',
      moisture: 'moist',
      archived: false,
    });
  });

  it('activates new, changed, removed, and restored definitions atomically', async () => {
    await writeDefinition(
      definitionsDirectory,
      'SP-051-changing.md',
      definition({ name: 'Changing', moisture: 'dry' }),
    );
    await writeDefinition(
      definitionsDirectory,
      'SP-052-removing.md',
      definition({ name: 'Removing' }),
    );
    await writeDefinition(
      definitionsDirectory,
      'SP-053-restoring.md',
      definition({ name: 'Restoring', moisture: 'dry' }),
    );
    expect((await synchronize(app)).status).toBe(204);
    await unlink(join(definitionsDirectory, 'SP-053-restoring.md'));
    expect((await synchronize(app)).status).toBe(204);

    await writeDefinition(
      definitionsDirectory,
      'SP-051-changing.md',
      definition({ name: 'Changed', moisture: 'wet' }),
    );
    await unlink(join(definitionsDirectory, 'SP-052-removing.md'));
    await writeDefinition(
      definitionsDirectory,
      'SP-053-restoring.md',
      definition({ name: 'Restored', moisture: 'moist' }),
    );
    await writeDefinition(
      definitionsDirectory,
      'SP-054-new.md',
      definition({ name: 'New' }),
    );

    const response = await synchronize(app);

    expect(response.status).toBe(204);
    expect(await repository.find({ order: { id: 'ASC' } })).toMatchObject([
      { id: 51, name: 'Changed', moisture: 'wet', archived: false },
      { id: 52, name: 'Removing', archived: true },
      { id: 53, name: 'Restored', moisture: 'moist', archived: false },
      { id: 54, name: 'New', archived: false },
    ]);
  });

  it('returns bodyless 500 and rolls back writes after an unexpected persistence failure', async () => {
    await dataSource.query(
      'ALTER TABLE "species" ADD CONSTRAINT "CHK_test_reject_species_062" CHECK ("id" <> 62)',
    );
    try {
      await writeDefinition(
        definitionsDirectory,
        'SP-061-first.md',
        definition({ name: 'First' }),
      );
      await writeDefinition(
        definitionsDirectory,
        'SP-062-rejected.md',
        definition({ name: 'Rejected' }),
      );

      const response = await synchronize(app);

      expect(response.status).toBe(500);
      expect(response.text).toBe('');
      await expect(repository.count()).resolves.toBe(0);
    } finally {
      await dataSource.query(
        'ALTER TABLE "species" DROP CONSTRAINT "CHK_test_reject_species_062"',
      );
    }
  });
});

function definition(overrides: Partial<DefinitionOptions> = {}): string {
  const options: DefinitionOptions = {
    name: 'Test Species',
    moisture: 'moist',
    light: 'bright-indirect',
    temperature: '18-28 °C',
    minimumTemperature: '12 °C',
    growthPeriod: 'March-October',
    bloomPeriod: 'unknown',
    dormancyPeriod: 'November-February',
    growthFertilizer: 'balanced',
    bloomFertilizer: 'species-specific',
    dormancyFertilizer: 'none',
    notes: ['A useful observation.'],
    ...overrides,
  };

  return `# ${options.name}

## Care

Moisture: ${options.moisture}
Light: ${options.light}
Temperature: ${options.temperature}
Minimum Temperature: ${options.minimumTemperature}

## Seasons

Growth: ${options.growthPeriod}
Bloom: ${options.bloomPeriod}
Dormancy: ${options.dormancyPeriod}

## Fertilizer

Growth: ${options.growthFertilizer}
Bloom: ${options.bloomFertilizer}
Dormancy: ${options.dormancyFertilizer}

## Notes

${options.notes.map((note) => `* ${note}`).join('\n')}
`;
}

async function writeDefinition(
  directory: string,
  filename: string,
  markdown: string,
): Promise<void> {
  await writeFile(join(directory, filename), markdown, 'utf8');
}

async function clearDefinitions(directory: string): Promise<void> {
  await mkdir(directory, { recursive: true });
  const filenames = await readdir(directory);
  await Promise.all(
    filenames.map((filename) =>
      rm(join(directory, filename), { recursive: true, force: true }),
    ),
  );
}

async function synchronize(app: INestApplication): Promise<request.Response> {
  return request(app.getHttpServer() as Server).post(
    '/api/admin/species/sync',
  );
}

async function rowVersion(dataSource: DataSource, id: number): Promise<string> {
  const rows = await dataSource.query<Array<{ version: string }>>(
    'SELECT xmin::text AS version FROM "species" WHERE "id" = $1',
    [id],
  );
  return rows[0].version;
}

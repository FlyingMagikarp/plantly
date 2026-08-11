import { ConfigService } from '@nestjs/config';
import { describe, expect, it } from 'vitest';
import { databaseOptions } from './database-options';
import { CreateSpecies1786449600000 } from './migrations/1786449600000-CreateSpecies';
import { CreateLocations1786453200000 } from './migrations/1786453200000-CreateLocations';
import { CreatePlants1786454626591 } from './migrations/1786454626591-CreatePlants';

describe('database options', () => {
  it('uses migrations rather than schema synchronization and runs every current migration at startup', () => {
    const options = databaseOptions(new ConfigService());

    expect(options.synchronize).toBe(false);
    expect(options.migrationsRun).toBe(true);
    expect(options.migrations).toEqual([
      CreateSpecies1786449600000,
      CreateLocations1786453200000,
      CreatePlants1786454626591,
    ]);
  });
});

import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CreateSpecies1786449600000 } from './migrations/1786449600000-CreateSpecies';
import { CreateLocations1786453200000 } from './migrations/1786453200000-CreateLocations';
import { CreatePlants1786454626591 } from './migrations/1786454626591-CreatePlants';

export function databaseOptions(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config.get('DATABASE_HOST', 'localhost'),
    port: config.get('DATABASE_PORT', 5432),
    database: config.get('DATABASE_NAME', 'plantlyv2'),
    username: config.get('DATABASE_USER', 'plantly'),
    password: config.get('DATABASE_PASSWORD', 'plantly'),
    autoLoadEntities: true,
    synchronize: false,
    migrations: [
      CreateSpecies1786449600000,
      CreateLocations1786453200000,
      CreatePlants1786454626591,
    ],
    migrationsRun: true,
    retryAttempts: 10,
    retryDelay: 3000,
  };
}

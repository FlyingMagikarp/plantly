import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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
    migrationsRun: false,
    retryAttempts: 10,
    retryDelay: 3000,
  };
}

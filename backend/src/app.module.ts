import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from './database/database-options';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { LocationsModule } from './locations/locations.module';
import { SpeciesModule } from './species/species.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseOptions,
    }),
    SpeciesModule,
    LocationsModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}

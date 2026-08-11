import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { SpeciesController } from './species.controller';
import { Species } from './species.entity';
import {
  SpeciesDefinitionsDirectory,
  SpeciesService,
} from './species.service';

@Module({
  imports: [TypeOrmModule.forFeature([Species])],
  controllers: [SpeciesController],
  providers: [
    SpeciesService,
    {
      provide: SpeciesDefinitionsDirectory,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new SpeciesDefinitionsDirectory(
          config.get<string>('SPECIES_DEFINITIONS_DIRECTORY') ??
            defaultDefinitionsDirectory(),
        ),
    },
  ],
})
export class SpeciesModule {}

function defaultDefinitionsDirectory(): string {
  const candidates = [
    resolve(process.cwd(), 'docs/species'),
    resolve(process.cwd(), '../docs/species'),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}

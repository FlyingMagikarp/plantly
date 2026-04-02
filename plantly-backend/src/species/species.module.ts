import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { Species } from './entities/species.entity';
import { SpeciesSeasonalTask } from './entities/species-seasonal-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Species, SpeciesSeasonalTask])],
  controllers: [SpeciesController],
  providers: [SpeciesService],
})
export class SpeciesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from './plant.entity';
import { PlantsController } from './plants.controller';
import { PlantClock, PlantsService } from './plants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plant])],
  controllers: [PlantsController],
  providers: [PlantsService, PlantClock],
})
export class PlantsModule {}

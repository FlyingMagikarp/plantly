import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantService } from './plant.service';
import { PlantController } from './plant.controller';
import { Plant } from './entities/plant.entity';
import { Species } from '../species/entities/species.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plant, Species])],
  controllers: [PlantController],
  providers: [PlantService],
  exports: [PlantService],
})
export class PlantModule {}

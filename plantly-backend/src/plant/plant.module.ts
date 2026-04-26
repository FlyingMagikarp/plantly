import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantService } from './plant.service';
import { PlantController } from './plant.controller';
import { Plant } from './entities/plant.entity';
import { PlantImage } from './entities/plant-image.entity';
import { Species } from '../species/entities/species.entity';

import { PlantAttentionService } from './plant-attention.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plant, PlantImage, Species])],
  controllers: [PlantController],
  providers: [PlantService, PlantAttentionService],
  exports: [PlantService, PlantAttentionService],
})
export class PlantModule {}

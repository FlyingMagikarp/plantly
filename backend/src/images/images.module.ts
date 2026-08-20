import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from '../plants/plant.entity';
import { ImageStorageService } from './image-storage.service';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { PlantImage } from './plant-image.entity';

@Module({ imports: [TypeOrmModule.forFeature([Plant, PlantImage])], controllers: [ImagesController], providers: [ImagesService, ImageStorageService], exports: [ImagesService] })
export class ImagesModule {}

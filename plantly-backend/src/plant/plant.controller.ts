import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { PlantService } from './plant.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { UpdatePlantImageDto } from './dto/update-plant-image.dto';
import { Plant } from './entities/plant.entity';
import { PlantImage } from './entities/plant-image.entity';

import { PlantStatus } from './enums/plant-status.enum';

@Controller('plants')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Post()
  async create(@Body() createPlantDto: CreatePlantDto): Promise<Plant> {
    return this.plantService.create(createPlantDto);
  }

  @Get()
  async findAll(
    @Query('showInactive') showInactive?: string,
    @Query('search') search?: string,
    @Query('status') status?: PlantStatus,
    @Query('speciesId') speciesId?: string,
  ): Promise<Plant[]> {
    return this.plantService.findAll(
      showInactive === 'true',
      search,
      status,
      speciesId,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Plant> {
    return this.plantService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlantDto: UpdatePlantDto,
  ): Promise<Plant> {
    return this.plantService.update(id, updatePlantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.plantService.remove(id);
  }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Array<any>,
  ): Promise<PlantImage[]> {
    return this.plantService.uploadImages(id, files);
  }

  @Get('images/:imageId')
  async getImage(
    @Param('imageId') imageId: string,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.plantService.getImage(imageId);
    res.setHeader('Content-Type', image.mimeType);
    // Add Cache-Control header to prevent aggressive or stale caching in PWA standalone mode
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(image.data);
  }

  @Patch('images/:imageId')
  async updateImage(
    @Param('imageId') imageId: string,
    @Body() updateImageDto: UpdatePlantImageDto,
  ): Promise<PlantImage> {
    return this.plantService.updateImage(imageId, updateImageDto);
  }

  @Delete('images/:imageId')
  async removeImage(@Param('imageId') imageId: string): Promise<void> {
    return this.plantService.removeImage(imageId);
  }
}

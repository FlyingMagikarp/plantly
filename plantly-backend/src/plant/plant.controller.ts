import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PlantService } from './plant.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from './entities/plant.entity';

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
}

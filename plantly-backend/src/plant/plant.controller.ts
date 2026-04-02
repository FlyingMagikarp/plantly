import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlantService } from './plant.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { Plant } from './entities/plant.entity';

@Controller('plants')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Post()
  async create(@Body() createPlantDto: CreatePlantDto): Promise<Plant> {
    return this.plantService.create(createPlantDto);
  }

  @Get()
  async findAll(): Promise<Plant[]> {
    return this.plantService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Plant> {
    return this.plantService.findOne(id);
  }
}

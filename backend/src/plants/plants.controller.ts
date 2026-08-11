import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { type PlantView, PlantsService } from './plants.service';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Get()
  list(): Promise<PlantView[]> {
    return this.plantsService.list();
  }

  @Get(':id')
  find(@Param('id', new ParseIntPipe()) id: number): Promise<PlantView> {
    return this.plantsService.find(id);
  }

  @Post()
  create(@Body() body: unknown): Promise<PlantView> {
    return this.plantsService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: unknown,
  ): Promise<PlantView> {
    return this.plantsService.update(id, body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: unknown,
  ): Promise<PlantView> {
    return this.plantsService.updateStatus(id, body);
  }

  @Patch(':id/location')
  updateLocation(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: unknown,
  ): Promise<PlantView> {
    return this.plantsService.updateLocation(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.plantsService.remove(id);
  }
}

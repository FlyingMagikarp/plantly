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
import { type LocationView, LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  list(): Promise<LocationView[]> {
    return this.locationsService.list();
  }

  @Post()
  create(@Body() body: unknown): Promise<LocationView> {
    return this.locationsService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: unknown,
  ): Promise<LocationView> {
    return this.locationsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.locationsService.remove(id);
  }
}

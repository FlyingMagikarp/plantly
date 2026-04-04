import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CareLogService } from './care-log.service';
import { CreateCareLogDto } from './dto/create-care-log.dto';

@Controller('plants/:plantId/care-logs')
export class CareLogController {
  constructor(private readonly careLogService: CareLogService) {}

  @Post()
  create(
    @Param('plantId') plantId: string,
    @Body() createCareLogDto: CreateCareLogDto,
  ) {
    return this.careLogService.create(plantId, createCareLogDto);
  }

  @Get()
  findAllByPlant(@Param('plantId') plantId: string) {
    return this.careLogService.findAllByPlant(plantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.careLogService.remove(id);
  }
}

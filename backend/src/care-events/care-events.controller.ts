import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CareEventsService, type CareEventView } from './care-events.service';

@Controller('plants/:plantId/care-events')
export class CareEventsController {
  constructor(private readonly careEventsService: CareEventsService) {}

  @Post()
  create(
    @Param('plantId', new ParseIntPipe()) plantId: number,
    @Body() body: unknown,
  ): Promise<CareEventView> {
    return this.careEventsService.create(plantId, body);
  }

  @Get()
  list(
    @Param('plantId', new ParseIntPipe()) plantId: number,
    @Query('page') page: string | undefined,
  ) {
    return this.careEventsService.list(plantId, page);
  }

  @Patch(':eventId')
  correct(
    @Param('plantId', new ParseIntPipe()) plantId: number,
    @Param('eventId', new ParseIntPipe()) eventId: number,
    @Body() body: unknown,
  ): Promise<CareEventView> {
    return this.careEventsService.correct(plantId, eventId, body);
  }

  @Delete(':eventId')
  remove(
    @Param('plantId', new ParseIntPipe()) plantId: number,
    @Param('eventId', new ParseIntPipe()) eventId: number,
  ): Promise<{ removedEventId: number }> {
    return this.careEventsService.remove(plantId, eventId);
  }
}

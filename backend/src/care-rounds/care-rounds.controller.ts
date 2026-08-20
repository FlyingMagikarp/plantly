import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CareEventsService, type CareEventView } from '../care-events/care-events.service';
import { CareRoundsService, type CareRoundOption, type CareRoundView } from './care-rounds.service';

@Controller('care-rounds')
export class CareRoundsController {
  constructor(private readonly rounds: CareRoundsService, private readonly events: CareEventsService) {}
  @Get('options') options(): Promise<CareRoundOption[]> { return this.rounds.options(); }
  @Get('active') active(): Promise<CareRoundView | null> { return this.rounds.active(); }
  @Get(':id') find(@Param('id', ParseIntPipe) id: number): Promise<CareRoundView> { return this.rounds.find(id); }
  @Post() start(@Body() body: unknown): Promise<CareRoundView> { return this.rounds.start(body); }
  @Patch(':id/progress') move(@Param('id', ParseIntPipe) id: number, @Body() body: unknown): Promise<CareRoundView> { return this.rounds.move(id, body); }
  @Post(':id/plants/:plantId/care-events') record(@Param('id', ParseIntPipe) id: number, @Param('plantId', ParseIntPipe) plantId: number, @Body() body: unknown): Promise<CareEventView> { return this.events.create(plantId, body, id); }
  @Patch(':id/complete') complete(@Param('id', ParseIntPipe) id: number): Promise<CareRoundView> { return this.rounds.complete(id); }
}

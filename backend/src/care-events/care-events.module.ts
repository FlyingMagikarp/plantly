import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareEvent } from './care-event.entity';
import { CareEventsController } from './care-events.controller';
import { CareEventClock, CareEventsService } from './care-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([CareEvent])],
  controllers: [CareEventsController],
  providers: [CareEventsService, CareEventClock],
  exports: [CareEventsService],
})
export class CareEventsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareEventsModule } from '../care-events/care-events.module';
import { Location } from '../locations/location.entity';
import { Plant } from '../plants/plant.entity';
import { CareRoundMember } from './care-round-member.entity';
import { CareRound } from './care-round.entity';
import { CareRoundsController } from './care-rounds.controller';
import { CareRoundsService } from './care-rounds.service';

@Module({ imports: [TypeOrmModule.forFeature([CareRound, CareRoundMember, Plant, Location]), CareEventsModule], controllers: [CareRoundsController], providers: [CareRoundsService] })
export class CareRoundsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Plant } from '../plant/entities/plant.entity';
import { CareLog } from '../care-log/entities/care-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plant, CareLog])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

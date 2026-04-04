import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareLogService } from './care-log.service';
import { CareLogController } from './care-log.controller';
import { CareLog } from './entities/care-log.entity';
import { Plant } from '../plant/entities/plant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CareLog, Plant])],
  controllers: [CareLogController],
  providers: [CareLogService],
  exports: [CareLogService],
})
export class CareLogModule {}

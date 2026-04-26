import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Plant } from '../plant/entities/plant.entity';
import { CareLog } from '../care-log/entities/care-log.entity';
import { PlantStatus } from '../plant/enums/plant-status.enum';
import {
  DashboardDto,
  RecentActivityDto,
  NeedsCheckPlantDto,
  ActivityType,
} from './dto/dashboard.dto';

import { PlantAttentionService } from '../plant/plant-attention.service';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @InjectRepository(CareLog)
    private readonly careLogRepository: Repository<CareLog>,
    private readonly plantAttentionService: PlantAttentionService,
    private readonly weatherService: WeatherService,
  ) {}

  async getDashboardData(): Promise<DashboardDto> {
    const totalPlants = await this.plantRepository.count({
      where: { status: PlantStatus.ACTIVE },
    });

    const recentLogs = await this.careLogRepository.find({
      relations: ['plant'],
      order: { date: 'DESC' },
      take: 10,
    });

    const recentPlantsCreated = await this.plantRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const recentPlantsUpdated = await this.plantRepository.find({
      where: {
        status: In([
          PlantStatus.DEAD,
          PlantStatus.REMOVED,
          PlantStatus.INACTIVE,
        ]),
      },
      order: { updatedAt: 'DESC' },
      take: 10,
    });

    const activities: RecentActivityDto[] = [];

    // 1. Add Care Logs
    recentLogs.forEach((log) => {
      activities.push({
        id: `care-${log.id}`,
        plantId: log.plantId,
        plantNickname: log.plant?.nickname || 'Unknown Plant',
        activityType: ActivityType.CARE_LOG,
        careType: log.type,
        date: log.date,
        note: log.note,
      });
    });

    // 2. Add New Plants
    recentPlantsCreated.forEach((plant) => {
      activities.push({
        id: `plant-add-${plant.id}`,
        plantId: plant.id,
        plantNickname: plant.nickname,
        activityType: ActivityType.PLANT_ADDED,
        date: plant.createdAt,
      });
    });

    // 3. Add Plant Status Changes (simplified: recent DEAD/REMOVED/INACTIVE status)
    recentPlantsUpdated.forEach((plant) => {
      let activityType = ActivityType.PLANT_REMOVED;
      if (plant.status === PlantStatus.DEAD)
        activityType = ActivityType.PLANT_DEAD;
      if (plant.status === PlantStatus.REMOVED)
        activityType = ActivityType.PLANT_REMOVED;
      if (plant.status === PlantStatus.INACTIVE)
        activityType = ActivityType.PLANT_GIVEN_AWAY; // Assuming INACTIVE could be used for something else, but here we synthesize

      activities.push({
        id: `plant-status-${plant.id}`,
        plantId: plant.id,
        plantNickname: plant.nickname,
        activityType,
        date: plant.updatedAt,
      });
    });

    // Sort all by date DESC and take top 5
    const finalRecentLogs = activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    // "Needs check" logic (v1 rules): Active plants that need attention according to PlantAttentionRules
    const activePlantsList = await this.plantRepository.find({
      where: { status: PlantStatus.ACTIVE },
      relations: ['careLogs', 'species'],
    });

    const needsCheck: NeedsCheckPlantDto[] = [];

    for (const plant of activePlantsList) {
      if (this.plantAttentionService.needsAttention(plant)) {
        const sortedLogs = [...plant.careLogs].sort(
          (a, b) => b.date.getTime() - a.date.getTime(),
        );
        const lastLog = sortedLogs[0];

        needsCheck.push({
          id: plant.id,
          nickname: plant.nickname,
          lastCheckDate: lastLog?.date || null,
        });
      }
    }

    const weatherData = await this.weatherService.getWeatherData();

    return {
      counts: {
        total: totalPlants,
        pendingTasks: needsCheck.length,
      },
      recentLogs: finalRecentLogs,
      needsCheck: needsCheck.slice(0, 10),
      weather: weatherData,
    };
  }
}

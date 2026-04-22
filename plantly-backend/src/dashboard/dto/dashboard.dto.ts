import { CareLogType } from '../../care-log/enums/care-log-type.enum';
import { WeatherDataDto } from '../../weather/dto/weather-data.dto';

export enum ActivityType {
  CARE_LOG = 'CARE_LOG',
  PLANT_ADDED = 'PLANT_ADDED',
  PLANT_REMOVED = 'PLANT_REMOVED',
  PLANT_DEAD = 'PLANT_DEAD',
  PLANT_GIVEN_AWAY = 'PLANT_GIVEN_AWAY',
}

export class RecentActivityDto {
  id!: string;
  plantId!: string;
  plantNickname!: string;
  activityType!: ActivityType;
  careType?: CareLogType; // If activityType === CARE_LOG
  date!: Date;
  note?: string | null;
}

export class NeedsCheckPlantDto {
  id!: string;
  nickname!: string;
  lastCheckDate?: Date | null;
}

export class DashboardDto {
  counts!: {
    total: number;
    pendingTasks: number;
  };
  recentLogs!: RecentActivityDto[];
  needsCheck!: NeedsCheckPlantDto[];
  weather?: WeatherDataDto;
}

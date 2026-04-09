import { Injectable } from '@nestjs/common';
import { Plant } from '../plant/entities/plant.entity';
import { CareLogType } from '../care-log/enums/care-log-type.enum';

@Injectable()
export class PlantAttentionService {
  private readonly BASE_ATTENTION_DAYS = 7;
  private readonly CHECK_ATTENTION_DAYS = 3;
  private readonly PEST_TREATMENT_ATTENTION_DAYS = 1;

  getAttentionDate(plant: Plant): Date {
    // If no care logs, attention is needed immediately
    if (!plant.careLogs || plant.careLogs.length === 0) {
      return new Date(0); // Far past
    }

    // Sort logs by date descending to find the last relevant log
    const sortedLogs = [...plant.careLogs].sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );
    const lastLog = sortedLogs[0];

    const waitDays = this.getWaitDays(lastLog.type, plant);

    const attentionDate = new Date(lastLog.date);
    attentionDate.setDate(attentionDate.getDate() + waitDays);

    return attentionDate;
  }

  needsAttention(plant: Plant): boolean {
    const attentionDate = this.getAttentionDate(plant);
    return attentionDate <= new Date();
  }

  private getWaitDays(type: CareLogType, plant: Plant): number {
    switch (type) {
      case CareLogType.WATER:
      case CareLogType.FERTILIZE:
      case CareLogType.REPOT:
        return (
          plant.species?.wateringGrowingMinDays ?? this.BASE_ATTENTION_DAYS
        );

      case CareLogType.CHECK:
      case CareLogType.PRUNE:
      case CareLogType.MOVE_INSIDE:
      case CareLogType.MOVE_OUTSIDE:
        return this.CHECK_ATTENTION_DAYS;

      case CareLogType.PEST_TREATMENT:
        return this.PEST_TREATMENT_ATTENTION_DAYS;

      default:
        return this.BASE_ATTENTION_DAYS;
    }
  }
}

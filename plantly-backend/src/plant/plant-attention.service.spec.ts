import { Test, TestingModule } from '@nestjs/testing';
import { PlantAttentionService } from './plant-attention.service';
import { Plant } from './entities/plant.entity';
import { CareLogType } from '../care-log/enums/care-log-type.enum';
import { Species } from '../species/entities/species.entity';
import { CareLog } from '../care-log/entities/care-log.entity';

describe('PlantAttentionService', () => {
  let service: PlantAttentionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantAttentionService],
    }).compile();

    service = module.get<PlantAttentionService>(PlantAttentionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('needsAttention', () => {
    it('should return true if plant has no care logs', () => {
      const plant = { careLogs: [] } as unknown as Plant;
      expect(service.needsAttention(plant)).toBe(true);
    });

    it('should return true if last log is WATER and species watering interval has passed', () => {
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 5);
      const plant = {
        species: { wateringGrowingMinDays: 4 },
        careLogs: [{ type: CareLogType.WATER, date: lastDate } as CareLog],
      } as unknown as Plant;
      expect(service.needsAttention(plant)).toBe(true);
    });

    it('should return false if last log is WATER and species watering interval has NOT passed', () => {
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 3);
      const plant = {
        species: { wateringGrowingMinDays: 4 },
        careLogs: [{ type: CareLogType.WATER, date: lastDate } as CareLog],
      } as unknown as Plant;
      expect(service.needsAttention(plant)).toBe(false);
    });

    it('should return true if last log is CHECK and 3 days have passed', () => {
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 4);
      const plant = {
        careLogs: [{ type: CareLogType.CHECK, date: lastDate } as CareLog],
      } as unknown as Plant;
      expect(service.needsAttention(plant)).toBe(true);
    });

    it('should return false if last log is CHECK and less than 3 days have passed', () => {
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 2);
      const plant = {
        careLogs: [{ type: CareLogType.CHECK, date: lastDate } as CareLog],
      } as unknown as Plant;
      expect(service.needsAttention(plant)).toBe(false);
    });

    it('should return true if last log is PEST_TREATMENT and 1 day has passed', () => {
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 2);
      const plant = {
        careLogs: [
          { type: CareLogType.PEST_TREATMENT, date: lastDate } as CareLog,
        ],
      } as unknown as Plant;
      expect(service.needsAttention(plant)).toBe(true);
    });

    it('should use base attention timer (7 days) for unknown types or fallbacks', () => {
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 6);
      const plant = {
        careLogs: [{ type: 'UNKNOWN_TYPE' as any, date: lastDate } as CareLog],
      } as unknown as Plant;
      expect(service.needsAttention(plant)).toBe(false);

      lastDate.setDate(lastDate.getDate() - 2); // 8 days ago
      expect(service.needsAttention(plant)).toBe(true);
    });

    it('should count FERTILIZE same as WATER', () => {
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 5);
      const plant = {
        species: { wateringGrowingMinDays: 4 },
        careLogs: [{ type: CareLogType.FERTILIZE, date: lastDate } as CareLog],
      } as unknown as Plant;
      expect(service.needsAttention(plant)).toBe(true);
    });

    it('should count PRUNE same as CHECK', () => {
      const lastDate = new Date();
      lastDate.setDate(lastDate.getDate() - 4);
      const plant = {
        careLogs: [{ type: CareLogType.PRUNE, date: lastDate } as CareLog],
      } as unknown as Plant;
      expect(service.needsAttention(plant)).toBe(true);
    });
  });
});

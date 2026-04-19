import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { PlantAttentionService } from '../plant/plant-attention.service';
import { Plant } from '../plant/entities/plant.entity';
import { CareLog } from '../care-log/entities/care-log.entity';
import { PlantStatus } from '../plant/enums/plant-status.enum';
import { CareLogType } from '../care-log/enums/care-log-type.enum';
import { ActivityType } from './dto/dashboard.dto';

describe('DashboardService', () => {
  let service: DashboardService;
  let plantRepository: any;
  let careLogRepository: any;
  let plantAttentionService: any;

  beforeEach(async () => {
    plantRepository = {
      count: jest.fn(),
      find: jest.fn(),
    };
    careLogRepository = {
      find: jest.fn(),
    };
    plantAttentionService = {
      needsAttention: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Plant),
          useValue: plantRepository,
        },
        {
          provide: getRepositoryToken(CareLog),
          useValue: careLogRepository,
        },
        {
          provide: PlantAttentionService,
          useValue: plantAttentionService,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should return dashboard data including various activities', async () => {
    plantRepository.count.mockResolvedValueOnce(10); // total

    careLogRepository.find.mockResolvedValue([
      {
        id: '1',
        plantId: '1',
        type: 'WATERING',
        date: new Date(),
        plant: { nickname: 'Ferny' },
      },
    ]);

    plantRepository.find.mockImplementation((options: any) => {
      if (options.where && options.where.status) {
        // recentPlantsUpdated
        return Promise.resolve([
          {
            id: '3',
            nickname: 'Gone',
            status: PlantStatus.REMOVED,
            updatedAt: new Date(),
            careLogs: [],
          },
        ]);
      }
      if (options.order && options.order.createdAt) {
        // recentPlantsCreated
        return Promise.resolve([
          {
            id: '1',
            nickname: 'Ferny',
            createdAt: new Date(),
            updatedAt: new Date(),
            careLogs: [],
          },
        ]);
      }
      // activePlantsList (for needsCheck)
      return Promise.resolve([
        {
          id: '1',
          nickname: 'Ferny',
          status: PlantStatus.ACTIVE,
          careLogs: [],
        },
      ]);
    });
    plantAttentionService.needsAttention.mockReturnValue(true);

    const result = await service.getDashboardData();

    expect(result.counts.total).toBe(10);
    expect(result.counts.pendingTasks).toBe(1); // One active plant in mock
    // Should have 3 activities: 1 care log, 1 added, 1 removed
    expect(result.recentLogs.length).toBeGreaterThanOrEqual(3);

    const careLog = result.recentLogs.find(
      (l) => l.activityType === ActivityType.CARE_LOG,
    );
    const addedLog = result.recentLogs.find(
      (l) => l.activityType === ActivityType.PLANT_ADDED,
    );
    const removedLog = result.recentLogs.find(
      (l) => l.activityType === ActivityType.PLANT_REMOVED,
    );

    expect(careLog).toBeDefined();
    expect(addedLog).toBeDefined();
    expect(removedLog).toBeDefined();
    expect(removedLog?.plantNickname).toBe('Gone');
  });

  it('should include plant in needsCheck if last log (any type) is old', async () => {
    plantRepository.count.mockResolvedValue(0);
    careLogRepository.find.mockResolvedValue([]);

    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    plantRepository.find.mockResolvedValue([
      {
        id: '1',
        nickname: 'Oldie',
        status: PlantStatus.ACTIVE,
        createdAt: eightDaysAgo,
        updatedAt: eightDaysAgo,
        careLogs: [{ type: CareLogType.WATERING, date: eightDaysAgo }],
      },
    ]);
    plantAttentionService.needsAttention.mockReturnValue(true);

    const result = await service.getDashboardData();
    expect(result.counts.pendingTasks).toBe(1);
    expect(result.needsCheck).toHaveLength(1);
    expect(result.needsCheck[0].nickname).toBe('Oldie');
  });
});

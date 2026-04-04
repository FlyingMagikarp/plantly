import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CareLogService } from './care-log.service';
import { CareLog } from './entities/care-log.entity';
import { Plant } from '../plant/entities/plant.entity';
import { CareLogType } from './enums/care-log-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('CareLogService', () => {
  let service: CareLogService;
  let careLogRepository: any;
  let plantRepository: any;

  beforeEach(async () => {
    careLogRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest
        .fn()
        .mockImplementation((log) => Promise.resolve({ id: '1', ...log })),
      find: jest.fn(),
      delete: jest.fn(),
    };

    plantRepository = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CareLogService,
        {
          provide: getRepositoryToken(CareLog),
          useValue: careLogRepository,
        },
        {
          provide: getRepositoryToken(Plant),
          useValue: plantRepository,
        },
      ],
    }).compile();

    service = module.get<CareLogService>(CareLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a care log', async () => {
      const dto = { type: CareLogType.WATERING, date: '2026-04-04T12:00:00Z', note: 'test' };
      plantRepository.findOneBy.mockResolvedValue({ id: '1' });

      const result = await service.create('1', dto);

      expect(result).toBeDefined();
      expect(result.plantId).toBe('1');
      expect(result.type).toBe(CareLogType.WATERING);
      expect(careLogRepository.create).toHaveBeenCalled();
      expect(careLogRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if plant not found', async () => {
      const dto = { type: CareLogType.WATERING, date: '2026-04-04T12:00:00Z' };
      plantRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create('999', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByPlant', () => {
    it('should return all care logs for a plant', async () => {
      plantRepository.findOneBy.mockResolvedValue({ id: '1' });
      careLogRepository.find.mockResolvedValue([{ id: '1', plantId: '1' }]);

      const result = await service.findAllByPlant('1');

      expect(result).toHaveLength(1);
      expect(careLogRepository.find).toHaveBeenCalledWith({
        where: { plantId: '1' },
        order: { date: 'DESC' },
      });
    });
  });

  describe('remove', () => {
    it('should delete a care log', async () => {
      careLogRepository.delete.mockResolvedValue({ affected: 1 });
      await expect(service.remove('1')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if care log not found', async () => {
      careLogRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});

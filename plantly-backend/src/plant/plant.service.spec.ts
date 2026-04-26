import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlantService } from './plant.service';
import { Plant } from './entities/plant.entity';
import { PlantImage } from './entities/plant-image.entity';
import { Species } from '../species/entities/species.entity';
import { NotFoundException } from '@nestjs/common';

import { PlantStatus } from './enums/plant-status.enum';

describe('PlantService', () => {
  let service: PlantService;
  let plantRepository: any;
  let speciesRepository: any;

  let queryBuilder: any;

  beforeEach(async () => {
    queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    plantRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest
        .fn()
        .mockImplementation((plant) => Promise.resolve({ id: '1', ...plant })),
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    speciesRepository = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantService,
        {
          provide: getRepositoryToken(Plant),
          useValue: plantRepository,
        },
        {
          provide: getRepositoryToken(PlantImage),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Species),
          useValue: speciesRepository,
        },
      ],
    }).compile();

    service = module.get<PlantService>(PlantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a plant', async () => {
      const dto = { nickname: 'Pothos', speciesId: '1' };
      speciesRepository.findOneBy.mockResolvedValue({ id: '1' });

      const result = await service.create(dto);

      expect(result).toBeDefined();
      expect(result.nickname).toBe('Pothos');
      expect(plantRepository.create).toHaveBeenCalled();
      expect(plantRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if species does not exist', async () => {
      const dto = { nickname: 'Pothos', speciesId: '999' };
      speciesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should show all plants when showInactive is true', async () => {
      const result = await service.findAll(true);
      expect(result).toEqual([]);
      expect(plantRepository.createQueryBuilder).toHaveBeenCalledWith('plant');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'plant.species',
        'species',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'plant.images',
        'images',
      );
      // No status filter should be applied when showInactive is true
      expect(queryBuilder.andWhere).not.toHaveBeenCalledWith(
        'plant.status = :status',
        expect.anything(),
      );
    });

    it('should filter active plants by default when showInactive is false', async () => {
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'plant.status = :status',
        { status: PlantStatus.ACTIVE },
      );
    });

    it('should filter by search term', async () => {
      await service.findAll(false, 'pothos');
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('LIKE LOWER(:search)'),
        { search: '%pothos%' },
      );
    });

    it('should filter by specific status', async () => {
      await service.findAll(false, undefined, PlantStatus.DEAD);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'plant.status = :status',
        { status: PlantStatus.DEAD },
      );
    });

    it('should filter by speciesId', async () => {
      await service.findAll(false, undefined, undefined, 'spec-123');
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'plant.speciesId = :speciesId',
        { speciesId: 'spec-123' },
      );
    });
  });

  describe('findOne', () => {
    it('should return a single plant', async () => {
      const plant = { id: '1', nickname: 'Pothos', images: [] };
      plantRepository.findOne.mockResolvedValue(plant);
      const result = await service.findOne('1');
      expect(result).toEqual(plant);
    });

    it('should throw NotFoundException if plant not found', async () => {
      plantRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });
  describe('remove', () => {
    it('should set plant status to REMOVED instead of deleting', async () => {
      const plant = {
        id: '1',
        nickname: 'Pothos',
        status: PlantStatus.ACTIVE,
        images: [],
      };
      plantRepository.findOne.mockResolvedValue(plant);

      await service.remove('1');

      expect(plant.status).toBe(PlantStatus.REMOVED);
      expect(plantRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if plant not found', async () => {
      plantRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});

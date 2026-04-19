import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SpeciesService } from './species.service';
import { Species } from './entities/species.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('SpeciesService', () => {
  let service: SpeciesService;
  let repository: any;

  let queryBuilder: any;

  beforeEach(async () => {
    queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeciesService,
        {
          provide: getRepositoryToken(Species),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<SpeciesService>(SpeciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('remove', () => {
    it('should delete species if not in use', async () => {
      const species = { id: '1', commonName: 'Fern', plants: [] };
      repository.findOne.mockResolvedValue(species);

      await service.remove('1');

      expect(repository.remove).toHaveBeenCalledWith(species);
    });

    it('should throw ConflictException if species is in use', async () => {
      const species = {
        id: '1',
        commonName: 'Fern',
        plants: [{ id: 'p1', nickname: 'My Fern' }],
      };
      repository.findOne.mockResolvedValue(species);

      await expect(service.remove('1')).rejects.toThrow(ConflictException);
      try {
        await service.remove('1');
      } catch (e: any) {
        expect(e.getResponse()).toMatchObject({
          error: 'SpeciesInUse',
          plantCount: 1,
        });
      }
    });

    it('should throw NotFoundException if species does not exist', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should show all species when showInactive is true', async () => {
      await service.findAll(true);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('species');
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'species.seasonalTasks',
        'seasonalTasks',
      );
      // No isActive filter should be applied when showInactive is true
      expect(queryBuilder.andWhere).not.toHaveBeenCalledWith(
        'species.isActive = :isActive',
        expect.anything(),
      );
    });

    it('should filter active species when showInactive is false (default)', async () => {
      await service.findAll(false);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'species.isActive = :isActive',
        { isActive: true },
      );
    });

    it('should filter by search term', async () => {
      await service.findAll(false, 'fern');
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('LIKE LOWER(:search)'),
        { search: '%fern%' },
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SpeciesService } from './species.service';
import { Species } from './entities/species.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('SpeciesService', () => {
  let service: SpeciesService;
  let repository: any;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
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
    it('should filter active species when onlyActive is true', async () => {
      await service.findAll(true);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        }),
      );
    });

    it('should not filter when onlyActive is false', async () => {
      await service.findAll(false);
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });
  });
});

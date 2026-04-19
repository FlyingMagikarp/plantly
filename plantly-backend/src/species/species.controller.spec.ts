import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SpeciesController } from './species.controller';
import { SpeciesService } from './species.service';
import { Species } from './entities/species.entity';

describe('SpeciesController', () => {
  let controller: SpeciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeciesController],
      providers: [
        SpeciesService,
        {
          provide: getRepositoryToken(Species),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SpeciesController>(SpeciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

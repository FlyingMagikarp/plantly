import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { Species } from '../species/entities/species.entity';

@Injectable()
export class PlantService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
  ) {}

  async create(createPlantDto: CreatePlantDto): Promise<Plant> {
    const species = await this.speciesRepository.findOneBy({
      id: createPlantDto.speciesId,
    });
    if (!species) {
      throw new NotFoundException(
        `Species with ID ${createPlantDto.speciesId} not found`,
      );
    }

    const plant = this.plantRepository.create({
      ...createPlantDto,
      acquiredAt: createPlantDto.acquiredAt
        ? new Date(createPlantDto.acquiredAt)
        : null,
    });

    return this.plantRepository.save(plant);
  }

  async findAll(): Promise<Plant[]> {
    return this.plantRepository.find({
      relations: ['species'],
      order: { nickname: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Plant> {
    const plant = await this.plantRepository.findOne({
      where: { id },
      relations: ['species'],
    });

    if (!plant) {
      throw new NotFoundException(`Plant with ID ${id} not found`);
    }

    return plant;
  }
}

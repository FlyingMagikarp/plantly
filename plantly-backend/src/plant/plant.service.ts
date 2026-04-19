import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Species } from '../species/entities/species.entity';

import { PlantStatus } from './enums/plant-status.enum';

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

  async findAll(
    showInactive = false,
    search?: string,
    status?: PlantStatus,
    speciesId?: string,
  ): Promise<Plant[]> {
    const query = this.plantRepository
      .createQueryBuilder('plant')
      .leftJoinAndSelect('plant.species', 'species');

    if (status) {
      query.andWhere('plant.status = :status', { status });
    } else if (!showInactive) {
      query.andWhere('plant.status = :status', { status: PlantStatus.ACTIVE });
    }

    if (speciesId) {
      query.andWhere('plant.speciesId = :speciesId', { speciesId });
    }

    if (search) {
      query.andWhere(
        '(LOWER(plant.nickname) LIKE LOWER(:search) OR LOWER(species.commonName) LIKE LOWER(:search) OR LOWER(species.scientificName) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.orderBy('plant.nickname', 'ASC').getMany();
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

  async update(id: string, updatePlantDto: UpdatePlantDto): Promise<Plant> {
    const plant = await this.findOne(id);

    if (updatePlantDto.speciesId) {
      const species = await this.speciesRepository.findOneBy({
        id: updatePlantDto.speciesId,
      });
      if (!species) {
        throw new NotFoundException(
          `Species with ID ${updatePlantDto.speciesId} not found`,
        );
      }
    }

    const updatedPlant = this.plantRepository.merge(plant, {
      ...updatePlantDto,
      acquiredAt: updatePlantDto.acquiredAt
        ? new Date(updatePlantDto.acquiredAt)
        : plant.acquiredAt,
    });

    return this.plantRepository.save(updatedPlant);
  }

  async remove(id: string): Promise<void> {
    const plant = await this.findOne(id);
    plant.status = PlantStatus.REMOVED;
    await this.plantRepository.save(plant);
  }
}

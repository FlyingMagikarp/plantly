import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
  ) {}

  async create(createSpeciesDto: CreateSpeciesDto): Promise<Species> {
    const species = this.speciesRepository.create(createSpeciesDto);
    return await this.speciesRepository.save(species);
  }

  async findAll(showInactive = false): Promise<Species[]> {
    return await this.speciesRepository.find({
      where: showInactive ? {} : { isActive: true },
      relations: { seasonalTasks: true },
      order: { commonName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Species> {
    const species = await this.speciesRepository.findOne({
      where: { id },
      relations: { seasonalTasks: true, plants: true },
    });
    if (!species) {
      throw new NotFoundException(`Species with ID ${id} not found`);
    }
    return species;
  }

  async update(
    id: string,
    updateSpeciesDto: UpdateSpeciesDto,
  ): Promise<Species> {
    const species = await this.findOne(id);
    Object.assign(species, updateSpeciesDto);
    return await this.speciesRepository.save(species);
  }

  async remove(id: string): Promise<void> {
    const species = await this.findOne(id);

    if (species.plants && species.plants.length > 0) {
      throw new ConflictException({
        message: 'Species is in use and cannot be deleted.',
        error: 'SpeciesInUse',
        speciesId: species.id,
        speciesName: species.commonName,
        plantCount: species.plants.length,
        plants: species.plants.map((p) => ({ id: p.id, nickname: p.nickname })),
      });
    }

    await this.speciesRepository.remove(species);
  }
}

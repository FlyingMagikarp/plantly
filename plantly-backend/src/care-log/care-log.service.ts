import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareLog } from './entities/care-log.entity';
import { CreateCareLogDto } from './dto/create-care-log.dto';
import { Plant } from '../plant/entities/plant.entity';

@Injectable()
export class CareLogService {
  constructor(
    @InjectRepository(CareLog)
    private readonly careLogRepository: Repository<CareLog>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
  ) {}

  async create(
    plantId: string,
    createCareLogDto: CreateCareLogDto,
  ): Promise<CareLog> {
    const plant = await this.plantRepository.findOneBy({ id: plantId });
    if (!plant) {
      throw new NotFoundException(`Plant with ID ${plantId} not found`);
    }

    const careLog = this.careLogRepository.create({
      ...createCareLogDto,
      plantId,
      date: new Date(createCareLogDto.date),
    });

    return this.careLogRepository.save(careLog);
  }

  async findAllByPlant(plantId: string): Promise<CareLog[]> {
    const plant = await this.plantRepository.findOneBy({ id: plantId });
    if (!plant) {
      throw new NotFoundException(`Plant with ID ${plantId} not found`);
    }

    return this.careLogRepository.find({
      where: { plantId },
      order: { date: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.careLogRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Care log with ID ${id} not found`);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Species} from "./entities/species.entity";
import {Repository} from "typeorm";

@Injectable()
export class SpeciesService {
  constructor(
      @InjectRepository(Species)
      private speciesRepository: Repository<Species>
  ) {}

  create(createSpeciesDto: CreateSpeciesDto) {
    return 'This action adds a new species';
  }

  findAll() {
    return this.speciesRepository.find({
      relations: {seasonalTasks: true},
      order: {commonName: 'ASC'}
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} species`;
  }

  update(id: number, updateSpeciesDto: UpdateSpeciesDto) {
    return `This action updates a #${id} species`;
  }

  remove(id: number) {
    return `This action removes a #${id} species`;
  }
}

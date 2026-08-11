import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  type SpeciesDetail,
  type SpeciesOverviewItem,
  SpeciesService,
} from './species.service';

@Controller('species')
export class SpeciesQueryController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Get()
  list(): Promise<SpeciesOverviewItem[]> {
    return this.speciesService.list();
  }

  @Get(':id')
  async find(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<SpeciesDetail> {
    const species = await this.speciesService.find(id);
    if (!species) {
      throw new NotFoundException('Species not found');
    }

    return species;
  }
}

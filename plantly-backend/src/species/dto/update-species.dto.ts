import { PartialType } from '@nestjs/mapped-types';
import { CreateSpeciesDto } from './create-species.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSpeciesDto extends PartialType(CreateSpeciesDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PlantStatus } from '../enums/plant-status.enum';

export class CreatePlantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nickname: string;

  @IsNumberString()
  @IsNotEmpty()
  speciesId: string;

  @IsDateString()
  @IsOptional()
  acquiredAt?: string;

  @IsEnum(PlantStatus)
  @IsOptional()
  status?: PlantStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}

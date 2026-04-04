import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CareLogType } from '../enums/care-log-type.enum';

export class CreateCareLogDto {
  @IsEnum(CareLogType)
  @IsNotEmpty()
  type: CareLogType;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  note?: string;
}

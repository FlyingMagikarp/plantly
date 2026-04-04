import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PlacementType } from '../enums/placement-type.enum';
import { LightLevel } from '../enums/light-level.enum';
import { WateringStrategy } from '../enums/watering-strategy.enum';
import { HumidityPreference } from '../enums/humidity-preference.enum';
import { SeasonType } from '../enums/season-type.enum';

export class CreateSpeciesDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  commonName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  commonNameDe: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  scientificName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PlacementType)
  placementType: PlacementType;

  @IsEnum(LightLevel)
  lightLevel: LightLevel;

  @IsEnum(WateringStrategy)
  wateringStrategy: WateringStrategy;

  @IsEnum(HumidityPreference)
  @IsOptional()
  humidityPreference?: HumidityPreference;

  @IsEnum(SeasonType)
  @IsOptional()
  dormantSeasonStart?: SeasonType;

  @IsEnum(SeasonType)
  @IsOptional()
  growthSeasonStart?: SeasonType;

  @IsInt()
  @Min(0)
  @IsOptional()
  wateringGrowingMinDays?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  wateringGrowingMaxDays?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  wateringDormantMinDays?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  wateringDormantMaxDays?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  fertilizingGrowingMinDays?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  fertilizingGrowingMaxDays?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  repottingFrequencyMinMonths?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  repottingFrequencyMaxMonths?: number;

  @IsEnum(SeasonType)
  @IsOptional()
  repottingSeason?: SeasonType;

  @IsEnum(SeasonType)
  @IsOptional()
  pruningSeason?: SeasonType;

  @IsNumberString()
  @IsOptional()
  idealTempMinC?: string;

  @IsNumberString()
  @IsOptional()
  idealTempMaxC?: string;

  @IsNumberString()
  @IsOptional()
  absoluteTempMinC?: string;

  @IsString()
  @IsOptional()
  wateringNotes?: string;

  @IsString()
  @IsOptional()
  fertilizingNotes?: string;

  @IsString()
  @IsOptional()
  repottingNotes?: string;

  @IsString()
  @IsOptional()
  pruningNotes?: string;

  @IsString()
  @IsOptional()
  placementNotes?: string;

  @IsString()
  @IsOptional()
  seasonNotes?: string;

  @IsString()
  @IsOptional()
  soilNotes?: string;

  @IsString()
  @IsOptional()
  pestNotes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

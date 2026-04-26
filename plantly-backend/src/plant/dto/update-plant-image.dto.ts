import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePlantImageDto {
  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  imageDate?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

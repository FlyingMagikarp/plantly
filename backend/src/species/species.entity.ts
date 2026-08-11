import { Check, Column, Entity, PrimaryColumn } from 'typeorm';
import type { Fertilizer, Light, Moisture } from './species.types';

@Check(
  'CHK_species_moisture',
  `"moisture" IN ('dry', 'slightly-dry', 'moist', 'wet')`,
)
@Check(
  'CHK_species_light',
  `"light" IN ('low', 'medium', 'bright-indirect', 'direct')`,
)
@Check(
  'CHK_species_temperature_range',
  '"preferred_temperature_min" <= "preferred_temperature_max"',
)
@Check(
  'CHK_species_growth_fertilizer',
  `"growth_fertilizer" IN ('none', 'balanced', 'foliage', 'bloom', 'species-specific')`,
)
@Check(
  'CHK_species_bloom_fertilizer',
  `"bloom_fertilizer" IN ('none', 'balanced', 'foliage', 'bloom', 'species-specific')`,
)
@Check(
  'CHK_species_dormancy_fertilizer',
  `"dormancy_fertilizer" IN ('none', 'balanced', 'foliage', 'bloom', 'species-specific')`,
)
@Check(
  'CHK_species_growth_none_fertilizer',
  `"growth_period" <> 'none' OR "growth_fertilizer" = 'none'`,
)
@Check(
  'CHK_species_bloom_none_fertilizer',
  `"bloom_period" <> 'none' OR "bloom_fertilizer" = 'none'`,
)
@Check(
  'CHK_species_dormancy_none_fertilizer',
  `"dormancy_period" <> 'none' OR "dormancy_fertilizer" = 'none'`,
)
@Entity({ name: 'species' })
export class Species {
  @PrimaryColumn({ type: 'integer' })
  id: number;

  @Column({ name: 'definition_slug', type: 'text', unique: true })
  definitionSlug: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  moisture: Moisture;

  @Column({ type: 'varchar', length: 20 })
  light: Light;

  @Column({ name: 'preferred_temperature_min', type: 'double precision' })
  preferredTemperatureMin: number;

  @Column({ name: 'preferred_temperature_max', type: 'double precision' })
  preferredTemperatureMax: number;

  @Column({ name: 'minimum_temperature', type: 'double precision' })
  minimumTemperature: number;

  @Column({ name: 'growth_period', type: 'varchar', length: 40 })
  growthPeriod: string;

  @Column({ name: 'bloom_period', type: 'varchar', length: 40 })
  bloomPeriod: string;

  @Column({ name: 'dormancy_period', type: 'varchar', length: 40 })
  dormancyPeriod: string;

  @Column({ name: 'growth_fertilizer', type: 'varchar', length: 20 })
  growthFertilizer: Fertilizer;

  @Column({ name: 'bloom_fertilizer', type: 'varchar', length: 20 })
  bloomFertilizer: Fertilizer;

  @Column({ name: 'dormancy_fertilizer', type: 'varchar', length: 20 })
  dormancyFertilizer: Fertilizer;

  @Column({ type: 'text', array: true, default: '{}' })
  notes: string[];

  @Column({ type: 'boolean', default: false })
  archived: boolean;

  @Column({ name: 'source_hash', type: 'char', length: 64 })
  sourceHash: string;
}

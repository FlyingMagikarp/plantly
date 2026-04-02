import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpeciesSeasonalTask } from './species-seasonal-task.entity';
import { PlacementType } from '../enums/placement-type.enum';
import { LightLevel } from '../enums/light-level.enum';
import { WateringStrategy } from '../enums/watering-strategy.enum';
import { HumidityPreference } from '../enums/humidity-preference.enum';
import { SeasonType } from '../enums/season-type.enum';

@Entity({ name: 'species' })
export class Species {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'common_name', type: 'varchar', length: 150 })
  commonName!: string;

  @Column({ name: 'common_name_de', type: 'varchar', length: 150 })
  commonNameDe!: string;

  @Column({ name: 'scientific_name', type: 'varchar', length: 200, unique: true })
  scientificName!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({
    name: 'placement_type',
    type: 'enum',
    enum: PlacementType,
    enumName: 'placement_type',
  })
  placementType!: PlacementType;

  @Column({
    name: 'light_level',
    type: 'enum',
    enum: LightLevel,
    enumName: 'light_level',
  })
  lightLevel!: LightLevel;

  @Column({
    name: 'watering_strategy',
    type: 'enum',
    enum: WateringStrategy,
    enumName: 'watering_strategy',
  })
  wateringStrategy!: WateringStrategy;

  @Column({
    name: 'humidity_preference',
    type: 'enum',
    enum: HumidityPreference,
    enumName: 'humidity_preference',
    nullable: true,
  })
  humidityPreference?: HumidityPreference | null;

  @Column({
    name: 'dormant_season_start',
    type: 'enum',
    enum: SeasonType,
    enumName: 'season_type',
    nullable: true,
  })
  dormant_season_start?: SeasonType | null;

  @Column({
    name: 'growth_season_start',
    type: 'enum',
    enum: SeasonType,
    enumName: 'season_type',
    nullable: true,
  })
  growth_season_start?: SeasonType | null;

  @Column({ name: 'watering_growing_min_days', type: 'int', nullable: true })
  wateringGrowingMinDays?: number | null;

  @Column({ name: 'watering_growing_max_days', type: 'int', nullable: true })
  wateringGrowingMaxDays?: number | null;

  @Column({ name: 'watering_dormant_min_days', type: 'int', nullable: true })
  wateringDormantMinDays?: number | null;

  @Column({ name: 'watering_dormant_max_days', type: 'int', nullable: true })
  wateringDormantMaxDays?: number | null;

  @Column({ name: 'fertilizing_growing_min_days', type: 'int', nullable: true })
  fertilizingGrowingMinDays?: number | null;

  @Column({ name: 'fertilizing_growing_max_days', type: 'int', nullable: true })
  fertilizingGrowingMaxDays?: number | null;

  @Column({ name: 'repotting_frequency_min_months', type: 'int', nullable: true })
  repottingFrequencyMinMonths?: number | null;

  @Column({ name: 'repotting_frequency_max_months', type: 'int', nullable: true })
  repottingFrequencyMaxMonths?: number | null;

  @Column({
    name: 'repotting_season',
    type: 'enum',
    enum: SeasonType,
    enumName: 'season_type',
    nullable: true,
  })
  repottingSeason?: SeasonType | null;

  @Column({
    name: 'pruning_season',
    type: 'enum',
    enum: SeasonType,
    enumName: 'season_type',
    nullable: true,
  })
  pruningSeason?: SeasonType | null;

  @Column({ name: 'ideal_temp_min_c', type: 'numeric', precision: 5, scale: 2, nullable: true })
  idealTempMinC?: string | null;

  @Column({ name: 'ideal_temp_max_c', type: 'numeric', precision: 5, scale: 2, nullable: true })
  idealTempMaxC?: string | null;

  @Column({ name: 'absolute_temp_min_c', type: 'numeric', precision: 5, scale: 2, nullable: true })
  absoluteTempMinC?: string | null;

  @Column({ name: 'watering_notes', type: 'text', nullable: true })
  wateringNotes?: string | null;

  @Column({ name: 'fertilizing_notes', type: 'text', nullable: true })
  fertilizingNotes?: string | null;

  @Column({ name: 'repotting_notes', type: 'text', nullable: true })
  repottingNotes?: string | null;

  @Column({ name: 'pruning_notes', type: 'text', nullable: true })
  pruningNotes?: string | null;

  @Column({ name: 'placement_notes', type: 'text', nullable: true })
  placementNotes?: string | null;

  @Column({ name: 'season_notes', type: 'text', nullable: true })
  seasonNotes?: string | null;

  @Column({ name: 'soil_notes', type: 'text', nullable: true })
  soilNotes?: string | null;

  @Column({ name: 'pest_notes', type: 'text', nullable: true })
  pestNotes?: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => SpeciesSeasonalTask, (task) => task.species)
  seasonalTasks!: SpeciesSeasonalTask[];
}
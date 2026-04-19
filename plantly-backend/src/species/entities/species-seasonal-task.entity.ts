import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Species } from './species.entity';
import { PlantTaskType } from '../enums/plant-task-type.enum';
import { SeasonType } from '../enums/season-type.enum';

@Entity({ name: 'species_seasonal_task' })
export class SpeciesSeasonalTask {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'species_id', type: 'bigint' })
  speciesId!: string;

  @ManyToOne(() => Species, (species) => species.seasonalTasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'species_id' })
  species!: Species;

  @Column({
    name: 'task_type',
    type: 'enum',
    enum: PlantTaskType,
    enumName: 'plant_task_type',
  })
  taskType!: PlantTaskType;

  @Column({
    name: 'season',
    type: 'enum',
    enum: SeasonType,
    enumName: 'season_type',
  })
  season!: SeasonType;

  @Column({ name: 'recommended_month_start', type: 'smallint', nullable: true })
  recommendedMonthStart?: number | null;

  @Column({ name: 'recommended_month_end', type: 'smallint', nullable: true })
  recommendedMonthEnd?: number | null;

  @Column({ name: 'priority', type: 'smallint', default: 0 })
  priority!: number;

  @Column({ name: 'title', type: 'varchar', length: 150 })
  title!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}

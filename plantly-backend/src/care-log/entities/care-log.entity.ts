import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity';
import { CareLogType } from '../enums/care-log-type.enum';

@Entity({ name: 'care_logs' })
export class CareLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'plant_id', type: 'bigint' })
  plantId!: string;

  @ManyToOne(() => Plant, (plant) => plant.careLogs)
  @JoinColumn({ name: 'plant_id' })
  plant!: Plant;

  @Column({
    name: 'type',
    type: 'enum',
    enum: CareLogType,
    enumName: 'care_log_type',
  })
  type!: CareLogType;

  @Column({ name: 'date', type: 'timestamptz' })
  date!: Date;

  @Column({ name: 'note', type: 'text', nullable: true })
  note?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}

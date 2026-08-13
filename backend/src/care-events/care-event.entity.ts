import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plant } from '../plants/plant.entity';

export const careEventTypes = [
  'watering',
  'pruning',
  'repotting',
  'pest-treatment',
  'observation',
] as const;
export type CareEventType = (typeof careEventTypes)[number];

@Check(
  'CHK_care_events_type',
  `"type" IN ('watering', 'pruning', 'repotting', 'pest-treatment', 'observation')`,
)
@Index('IDX_care_events_plant_timestamp', ['plantId', 'timestamp'])
@Entity({ name: 'care_events' })
export class CareEvent {
  @PrimaryGeneratedColumn('identity', { type: 'integer' })
  id: number;

  @Column({ name: 'plant_id', type: 'integer' })
  plantId: number;

  @ManyToOne(() => Plant, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plant_id', foreignKeyConstraintName: 'FK_care_events_plant' })
  plant: Plant;

  @Column({ type: 'varchar', length: 32 })
  type: CareEventType;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'fertilizer_included', type: 'boolean', nullable: true })
  fertilizerIncluded: boolean | null;
}

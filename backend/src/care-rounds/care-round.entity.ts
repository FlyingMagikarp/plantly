import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type CareRoundStatus = 'active' | 'completed';

@Index('UQ_care_rounds_one_active', ['status'], { unique: true, where: '"status" = \'active\'' })
@Entity({ name: 'care_rounds' })
export class CareRound {
  @PrimaryGeneratedColumn('identity', { type: 'integer' }) id: number;
  @Column({ name: 'location_id', type: 'integer', nullable: true }) locationId: number | null;
  @Column({ name: 'location_name', type: 'text', nullable: true }) locationName: string | null;
  @Column({ type: 'varchar', length: 12, default: 'active' }) status: CareRoundStatus;
  @Column({ name: 'current_index', type: 'integer', default: 0 }) currentIndex: number;
  @CreateDateColumn({ name: 'started_at', type: 'timestamptz' }) startedAt: Date;
  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true }) completedAt: Date | null;
}

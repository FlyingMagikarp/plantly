import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plant } from '../plants/plant.entity';
import { CareRound } from './care-round.entity';

@Index('UQ_care_round_members_position', ['roundId', 'position'], { unique: true })
@Index('UQ_care_round_members_plant', ['roundId', 'plantId'], { unique: true })
@Entity({ name: 'care_round_members' })
export class CareRoundMember {
  @PrimaryGeneratedColumn('identity', { type: 'integer' }) id: number;
  @Column({ name: 'round_id', type: 'integer' }) roundId: number;
  @ManyToOne(() => CareRound, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'round_id', foreignKeyConstraintName: 'FK_care_round_members_round' }) round: CareRound;
  @Column({ name: 'plant_id', type: 'integer', nullable: true }) plantId: number | null;
  @ManyToOne(() => Plant, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'plant_id', foreignKeyConstraintName: 'FK_care_round_members_plant' }) plant: Plant | null;
  @Column({ type: 'integer' }) position: number;
  @Column({ name: 'plant_nickname', type: 'text' }) plantNickname: string;
  @Column({ name: 'species_name', type: 'text' }) speciesName: string;
}

import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../locations/location.entity';
import { Species } from '../species/species.entity';

export const plantStatuses = ['active', 'dead', 'archived'] as const;
export type PlantStatus = (typeof plantStatuses)[number];

@Check('CHK_plants_nickname_present', 'length(trim("nickname")) > 0')
@Check(
  'CHK_plants_status',
  `"status" IN ('active', 'dead', 'archived')`,
)
@Index('IDX_plants_species_id', ['speciesId'])
@Index('IDX_plants_location_id', ['locationId'])
@Index('IDX_plants_status', ['status'])
@Entity({ name: 'plants' })
export class Plant {
  @PrimaryGeneratedColumn('identity', { type: 'integer' })
  id: number;

  @Column({ type: 'text' })
  nickname: string;

  @Column({ name: 'species_id', type: 'integer' })
  speciesId: number;

  @ManyToOne(() => Species, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'species_id', foreignKeyConstraintName: 'FK_plants_species' })
  species: Species;

  @Column({ name: 'acquisition_date', type: 'date' })
  acquisitionDate: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', length: 10, default: 'active' })
  status: PlantStatus;

  @Column({ name: 'location_id', type: 'integer', nullable: true })
  locationId: number | null;

  @ManyToOne(() => Location, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'location_id',
    foreignKeyConstraintName: 'FK_plants_location',
  })
  location: Location | null;
}

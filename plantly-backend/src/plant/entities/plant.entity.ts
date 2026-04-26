import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Species } from '../../species/entities/species.entity';
import { CareLog } from '../../care-log/entities/care-log.entity';
import { PlantStatus } from '../enums/plant-status.enum';
import { PlantImage } from './plant-image.entity';

@Entity({ name: 'plants' })
export class Plant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'nickname', type: 'varchar', length: 150 })
  nickname!: string;

  @Column({ name: 'species_id', type: 'bigint' })
  speciesId!: string;

  @ManyToOne(() => Species, (species) => species.plants)
  @JoinColumn({ name: 'species_id' })
  species!: Species;

  @OneToMany(() => CareLog, (careLog) => careLog.plant)
  careLogs!: CareLog[];

  @OneToMany(() => PlantImage, (plantImage) => plantImage.plant)
  images!: PlantImage[];

  @Column({ name: 'acquired_at', type: 'timestamptz', nullable: true })
  acquiredAt?: Date | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PlantStatus,
    enumName: 'plant_status',
    default: PlantStatus.ACTIVE,
  })
  status!: PlantStatus;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}

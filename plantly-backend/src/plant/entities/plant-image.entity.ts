import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Plant } from './plant.entity';

@Entity({ name: 'plant_images' })
export class PlantImage {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'plant_id', type: 'bigint' })
  plantId!: string;

  @ManyToOne(() => Plant, (plant) => plant.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plant_id' })
  plant!: Plant;

  @Column({ name: 'data', type: 'bytea' })
  data!: Buffer;

  @Column({ name: 'mime_type', type: 'varchar', length: 50 })
  mimeType!: string;

  @Column({
    name: 'original_filename',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  originalFilename?: string | null;

  @Column({ name: 'caption', type: 'varchar', length: 255, nullable: true })
  caption?: string | null;

  @Column({ name: 'image_date', type: 'timestamptz', nullable: true })
  imageDate?: Date | null;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}

import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plant } from '../plants/plant.entity';

@Index('IDX_plant_images_plant_added', ['plantId', 'addedAt', 'id'])
@Entity({ name: 'plant_images' })
export class PlantImage {
  @PrimaryGeneratedColumn('identity', { type: 'integer' })
  id: number;

  @Column({ name: 'plant_id', type: 'integer' })
  plantId: number;

  @ManyToOne(() => Plant, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plant_id', foreignKeyConstraintName: 'FK_plant_images_plant' })
  plant: Plant;

  @Column({ name: 'storage_key', type: 'text', unique: true })
  storageKey: string;

  @Column({ name: 'media_type', type: 'varchar', length: 16 })
  mediaType: 'image/jpeg' | 'image/png';

  @Column({ name: 'byte_size', type: 'integer' })
  byteSize: number;

  @CreateDateColumn({ name: 'added_at', type: 'timestamptz' })
  addedAt: Date;
}

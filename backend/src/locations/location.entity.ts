import {
  Check,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Check('CHK_locations_name_present', 'length(rtrim("name")) > 0')
@Check('CHK_locations_name_trailing_whitespace', '"name" = rtrim("name")')
@Index('UQ_locations_name_case_insensitive', { synchronize: false })
@Entity({ name: 'locations' })
export class Location {
  @PrimaryGeneratedColumn('identity', { type: 'integer' })
  id: number;

  @Column({ type: 'text' })
  name: string;
}

import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Species } from '../species/entities/species.entity';
import { SpeciesSeasonalTask } from '../species/entities/species-seasonal-task.entity';

const AppDataSource = new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,

  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [
    Species,
    SpeciesSeasonalTask,
  ],

  migrations: [
    'src/db/migration/*.ts',
  ],

  synchronize: false,

  logging: true,
});

export default AppDataSource;
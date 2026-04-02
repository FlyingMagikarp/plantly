import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpeciesEnums1773329753378 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /* ENUMS */
    await queryRunner.query(
      `CREATE TYPE placement_type AS ENUM ('INDOOR', 'OUTDOOR', 'BOTH');`,
    );

    await queryRunner.query(`
        CREATE TYPE light_level AS ENUM (
          'LOW',
          'MEDIUM',
          'BRIGHT_INDIRECT',
          'DIRECT_SUN',
          'FULL_SUN',
          'PARTIAL_SHADE'
        );
        `);

    await queryRunner.query(`
            CREATE TYPE watering_strategy AS ENUM (
              'KEEP_EVENLY_MOIST',
              'WATER_WHEN_TOP_SOIL_DRY',
              'LET_MOSTLY_DRY_OUT',
              'LET_FULLY_DRY_OUT'
            );
        `);

    await queryRunner.query(
      `CREATE TYPE humidity_preference AS ENUM ('LOW', 'NORMAL', 'HIGH');`,
    );

    await queryRunner.query(
      `CREATE TYPE season_type AS ENUM ('SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'ALL_YEAR');`,
    );

    await queryRunner.query(`
            CREATE TYPE plant_task_type AS ENUM (
              'CHECK',
              'WATER',
              'FERTILIZE',
              'PRUNE',
              'REPOT',
              'MOVE_INSIDE',
              'MOVE_OUTSIDE',
              'PEST_TREATMENT'
            );
        `);

    /* TABLES */

    await queryRunner.query(`
            CREATE TABLE species (
                id BIGSERIAL PRIMARY KEY,
                
                common_name VARCHAR(150) NOT NULL,
                common_name_de VARCHAR(150) NOT NULL,
                scientific_name VARCHAR(200) NOT NULL,
                description TEXT,
                
                placement_type placement_type NOT NULL,
                light_level light_level NOT NULL,
                watering_strategy watering_strategy NOT NULL,
                humidity_preference humidity_preference,
                
                dormant_season_start season_type,
                growth_season_start season_type,
                
                watering_growing_min_days INTEGER,
                watering_growing_max_days INTEGER,
                watering_dormant_min_days INTEGER,
                watering_dormant_max_days INTEGER,
                
                fertilizing_growing_min_days INTEGER,
                fertilizing_growing_max_days INTEGER,
                
                repotting_frequency_min_months INTEGER,
                repotting_frequency_max_months INTEGER,
                repotting_season season_type,
                
                pruning_season season_type,
                
                ideal_temp_min_c NUMERIC(5,2),
                ideal_temp_max_c NUMERIC(5,2),
                absolute_temp_min_c NUMERIC(5,2),
                
                watering_notes TEXT,
                fertilizing_notes TEXT,
                repotting_notes TEXT,
                pruning_notes TEXT,
                placement_notes TEXT,
                season_notes TEXT,
                soil_notes TEXT,
                pest_notes TEXT,
                
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                
                CONSTRAINT uq_species_scientific_name UNIQUE (scientific_name),
                
                CONSTRAINT chk_species_watering_growing_range
                CHECK (
                    watering_growing_min_days IS NULL
                    OR watering_growing_max_days IS NULL
                    OR watering_growing_min_days <= watering_growing_max_days
                ),
                
                CONSTRAINT chk_species_watering_dormant_range
                CHECK (
                    watering_dormant_min_days IS NULL
                    OR watering_dormant_max_days IS NULL
                    OR watering_dormant_min_days <= watering_dormant_max_days
                ),
                
                CONSTRAINT chk_species_fertilizing_growing_range
                CHECK (
                    fertilizing_growing_min_days IS NULL
                    OR fertilizing_growing_max_days IS NULL
                    OR fertilizing_growing_min_days <= fertilizing_growing_max_days
                ),
                
                CONSTRAINT chk_species_repotting_range
                CHECK (
                    repotting_frequency_min_months IS NULL
                    OR repotting_frequency_max_months IS NULL
                    OR repotting_frequency_min_months <= repotting_frequency_max_months
                )
                );
        `);

    await queryRunner.query(`
            CREATE TABLE species_seasonal_task (
            id BIGSERIAL PRIMARY KEY,
            
            species_id BIGINT NOT NULL REFERENCES species(id) ON DELETE CASCADE,
            
            task_type plant_task_type NOT NULL,
            season season_type NOT NULL,
            
            recommended_month_start SMALLINT,
            recommended_month_end SMALLINT,
            
            priority SMALLINT NOT NULL DEFAULT 0,
            title VARCHAR(150) NOT NULL,
            description TEXT,
            notes TEXT,
            
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            
            CONSTRAINT chk_species_seasonal_task_month_start
            CHECK (
                recommended_month_start IS NULL
                OR recommended_month_start BETWEEN 1 AND 12
            ),
            
            CONSTRAINT chk_species_seasonal_task_month_end
            CHECK (
                recommended_month_end IS NULL
                OR recommended_month_end BETWEEN 1 AND 12
            ),
            
            CONSTRAINT chk_species_seasonal_task_month_range
            CHECK (
                recommended_month_start IS NULL
                OR recommended_month_end IS NULL
                OR recommended_month_start <= recommended_month_end
            )
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS species_seasonal_task`);

    await queryRunner.query(`DROP TABLE IF EXISTS species`);

    await queryRunner.query(`DROP TYPE IF EXISTS plant_task_type`);

    await queryRunner.query(`DROP TYPE IF EXISTS season_type`);

    await queryRunner.query(`DROP TYPE IF EXISTS humidity_preference`);

    await queryRunner.query(`DROP TYPE IF EXISTS watering_strategy`);

    await queryRunner.query(`DROP TYPE IF EXISTS light_level`);

    await queryRunner.query(`DROP TYPE IF EXISTS placement_type`);
  }
}

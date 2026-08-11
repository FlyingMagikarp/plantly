import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpecies1786449600000 implements MigrationInterface {
  name = 'CreateSpecies1786449600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "species" (
        "id" integer NOT NULL,
        "definition_slug" text NOT NULL,
        "name" text NOT NULL,
        "moisture" character varying(20) NOT NULL,
        "light" character varying(20) NOT NULL,
        "preferred_temperature_min" double precision NOT NULL,
        "preferred_temperature_max" double precision NOT NULL,
        "minimum_temperature" double precision NOT NULL,
        "growth_period" character varying(40) NOT NULL,
        "bloom_period" character varying(40) NOT NULL,
        "dormancy_period" character varying(40) NOT NULL,
        "growth_fertilizer" character varying(20) NOT NULL,
        "bloom_fertilizer" character varying(20) NOT NULL,
        "dormancy_fertilizer" character varying(20) NOT NULL,
        "notes" text array NOT NULL DEFAULT '{}',
        "archived" boolean NOT NULL DEFAULT false,
        "source_hash" character(64) NOT NULL,
        CONSTRAINT "PK_species" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_species_definition_slug" UNIQUE ("definition_slug"),
        CONSTRAINT "CHK_species_moisture" CHECK ("moisture" IN ('dry', 'slightly-dry', 'moist', 'wet')),
        CONSTRAINT "CHK_species_light" CHECK ("light" IN ('low', 'medium', 'bright-indirect', 'direct')),
        CONSTRAINT "CHK_species_temperature_range" CHECK ("preferred_temperature_min" <= "preferred_temperature_max"),
        CONSTRAINT "CHK_species_growth_fertilizer" CHECK ("growth_fertilizer" IN ('none', 'balanced', 'foliage', 'bloom', 'species-specific')),
        CONSTRAINT "CHK_species_bloom_fertilizer" CHECK ("bloom_fertilizer" IN ('none', 'balanced', 'foliage', 'bloom', 'species-specific')),
        CONSTRAINT "CHK_species_dormancy_fertilizer" CHECK ("dormancy_fertilizer" IN ('none', 'balanced', 'foliage', 'bloom', 'species-specific')),
        CONSTRAINT "CHK_species_growth_none_fertilizer" CHECK ("growth_period" <> 'none' OR "growth_fertilizer" = 'none'),
        CONSTRAINT "CHK_species_bloom_none_fertilizer" CHECK ("bloom_period" <> 'none' OR "bloom_fertilizer" = 'none'),
        CONSTRAINT "CHK_species_dormancy_none_fertilizer" CHECK ("dormancy_period" <> 'none' OR "dormancy_fertilizer" = 'none')
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "species"');
  }
}

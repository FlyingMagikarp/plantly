import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlantsTable1775132546660 implements MigrationInterface {
  name = 'CreatePlantsTable1775132546660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."plant_status" AS ENUM('active', 'inactive', 'removed', 'dead')`,
    );
    await queryRunner.query(
      `CREATE TABLE "plants" ("id" BIGSERIAL NOT NULL, "nickname" character varying(150) NOT NULL, "species_id" bigint NOT NULL, "acquired_at" TIMESTAMP WITH TIME ZONE, "status" "public"."plant_status" NOT NULL DEFAULT 'active', "notes" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7056d6b283b48ee2bb0e53bee60" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "plants" ADD CONSTRAINT "FK_ed3bdb6774cf48ac854bbbfe230" FOREIGN KEY ("species_id") REFERENCES "species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plants" DROP CONSTRAINT "FK_ed3bdb6774cf48ac854bbbfe230"`,
    );
    await queryRunner.query(`DROP TABLE "plants"`);
    await queryRunner.query(`DROP TYPE "public"."plant_status"`);
  }
}

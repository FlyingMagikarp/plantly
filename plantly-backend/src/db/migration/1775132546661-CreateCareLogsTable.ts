import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCareLogsTable1775132546661 implements MigrationInterface {
  name = 'CreateCareLogsTable1775132546661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."care_log_type" AS ENUM('WATERING', 'FERTILIZING', 'PRUNING', 'REPOTTING', 'CHECK')`,
    );
    await queryRunner.query(
      `CREATE TABLE "care_logs" ("id" BIGSERIAL NOT NULL, "plant_id" bigint NOT NULL, "type" "public"."care_log_type" NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "note" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_care_logs" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "care_logs" ADD CONSTRAINT "FK_care_logs_plant_id" FOREIGN KEY ("plant_id") REFERENCES "plants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "care_logs" DROP CONSTRAINT "FK_care_logs_plant_id"`,
    );
    await queryRunner.query(`DROP TABLE "care_logs"`);
    await queryRunner.query(`DROP TYPE "public"."care_log_type"`);
  }
}

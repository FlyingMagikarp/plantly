import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlantImagesTable1777207000000 implements MigrationInterface {
  name = 'AddPlantImagesTable1777207000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "plant_images"`);
    await queryRunner.query(`CREATE TABLE "plant_images" (
            "id" BIGSERIAL PRIMARY KEY,
            "plant_id" bigint NOT NULL,
            "data" bytea NOT NULL,
            "mime_type" varchar(50) NOT NULL,
            "original_filename" varchar(255),
            "caption" varchar(255),
            "image_date" timestamptz,
            "is_primary" boolean NOT NULL DEFAULT false,
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT "FK_plant_images_plant" FOREIGN KEY ("plant_id") REFERENCES "plants"("id") ON DELETE CASCADE
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "plant_images"`);
  }
}

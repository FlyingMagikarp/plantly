import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCareLogTypeEnum1775339845412 implements MigrationInterface {
    name = 'UpdateCareLogTypeEnum1775339845412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."care_log_type" RENAME TO "care_log_type_old"`);
        await queryRunner.query(`CREATE TYPE "public"."care_log_type" AS ENUM('WATER', 'FERTILIZE', 'PRUNE', 'REPOT', 'CHECK', 'MOVE_INSIDE', 'MOVE_OUTSIDE', 'PEST_TREATMENT')`);
        
        // Use text mapping for migration
        await queryRunner.query(`ALTER TABLE "care_logs" ALTER COLUMN "type" TYPE "public"."care_log_type" USING 
            CASE 
                WHEN "type"::text = 'WATERING' THEN 'WATER'::"public"."care_log_type"
                WHEN "type"::text = 'FERTILIZING' THEN 'FERTILIZE'::"public"."care_log_type"
                WHEN "type"::text = 'PRUNING' THEN 'PRUNE'::"public"."care_log_type"
                WHEN "type"::text = 'REPOTTING' THEN 'REPOT'::"public"."care_log_type"
                WHEN "type"::text = 'CHECK' THEN 'CHECK'::"public"."care_log_type"
                ELSE 'CHECK'::"public"."care_log_type"
            END`);
            
        await queryRunner.query(`DROP TYPE "public"."care_log_type_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."care_log_type_old" AS ENUM('WATERING', 'FERTILIZING', 'PRUNING', 'REPOTTING', 'CHECK')`);
        
        await queryRunner.query(`ALTER TABLE "care_logs" ALTER COLUMN "type" TYPE "public"."care_log_type_old" USING 
            CASE 
                WHEN "type"::text = 'WATER' THEN 'WATERING'::"public"."care_log_type_old"
                WHEN "type"::text = 'FERTILIZE' THEN 'FERTILIZING'::"public"."care_log_type_old"
                WHEN "type"::text = 'PRUNE' THEN 'PRUNING'::"public"."care_log_type_old"
                WHEN "type"::text = 'REPOT' THEN 'REPOTTING'::"public"."care_log_type_old"
                ELSE 'CHECK'::"public"."care_log_type_old"
            END`);

        await queryRunner.query(`DROP TYPE "public"."care_log_type"`);
        await queryRunner.query(`ALTER TYPE "public"."care_log_type_old" RENAME TO "care_log_type"`);
    }

}

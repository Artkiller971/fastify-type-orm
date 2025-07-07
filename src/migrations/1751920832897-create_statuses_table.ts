import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStatusesTable1751920832897 implements MigrationInterface {
    name = 'CreateStatusesTable1751920832897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "statuses" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "statuses"
        `);
    }

}

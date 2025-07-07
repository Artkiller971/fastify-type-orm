import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLabelsTable1751920832897 implements MigrationInterface {
    name = 'CreateLabelsTable1751920832897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "labels" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "labels"
        `);
    }

}

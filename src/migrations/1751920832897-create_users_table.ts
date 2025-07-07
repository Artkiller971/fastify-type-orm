import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1751920832897 implements MigrationInterface {
    name = 'CreateUsersTable1751920832897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "first_name" varchar NOT NULL,
                "last_name" varchar NOT NULL,
                "email" varchar NOT NULL,
                "password" varchar NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}

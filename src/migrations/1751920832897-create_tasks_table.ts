import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksTable1751920832897 implements MigrationInterface {
    name = 'CreateTasksTable1751920832897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "description" varchar,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                "status_id" integer,
                "creator_id" integer,
                "executor_id" integer
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_tasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "description" varchar,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                "status_id" integer,
                "creator_id" integer,
                "executor_id" integer,
                CONSTRAINT "FK_e28288969fa7827bd12680cfe10" FOREIGN KEY ("status_id") REFERENCES "statuses" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_f4cb489461bc751498a28852356" FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_dfa19206f84d97530851c2bfa5c" FOREIGN KEY ("executor_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_tasks"(
                    "id",
                    "name",
                    "description",
                    "created_at",
                    "updated_at",
                    "status_id",
                    "creator_id",
                    "executor_id"
                )
            SELECT "id",
                "name",
                "description",
                "created_at",
                "updated_at",
                "status_id",
                "creator_id",
                "executor_id"
            FROM "tasks"
        `);
        await queryRunner.query(`
            DROP TABLE "tasks"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_tasks"
                RENAME TO "tasks"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tasks"
                RENAME TO "temporary_tasks"
        `);
        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "description" varchar,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                "status_id" integer,
                "creator_id" integer,
                "executor_id" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "tasks"(
                    "id",
                    "name",
                    "description",
                    "created_at",
                    "updated_at",
                    "status_id",
                    "creator_id",
                    "executor_id"
                )
            SELECT "id",
                "name",
                "description",
                "created_at",
                "updated_at",
                "status_id",
                "creator_id",
                "executor_id"
            FROM "temporary_tasks"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_tasks"
        `);
        await queryRunner.query(`
            DROP TABLE "tasks"
        `);
    }

}

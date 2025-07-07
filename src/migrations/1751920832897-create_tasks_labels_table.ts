import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskStatusesTable1751920832897 implements MigrationInterface {
    name = 'CreateTaskStatusesTable1751920832897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "tasks_labels" (
                "tasks_id" integer NOT NULL,
                "labels_id" integer NOT NULL,
                PRIMARY KEY ("tasks_id", "labels_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_77ad7bb1791d01e31999a717ac" ON "tasks_labels" ("tasks_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b3ffce2c889ab52554e560d31b" ON "tasks_labels" ("labels_id")
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_77ad7bb1791d01e31999a717ac"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_b3ffce2c889ab52554e560d31b"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_tasks_labels" (
                "tasks_id" integer NOT NULL,
                "labels_id" integer NOT NULL,
                CONSTRAINT "FK_77ad7bb1791d01e31999a717ac9" FOREIGN KEY ("tasks_id") REFERENCES "tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_b3ffce2c889ab52554e560d31b3" FOREIGN KEY ("labels_id") REFERENCES "labels" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                PRIMARY KEY ("tasks_id", "labels_id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_tasks_labels"("tasks_id", "labels_id")
            SELECT "tasks_id",
                "labels_id"
            FROM "tasks_labels"
        `);
        await queryRunner.query(`
            DROP TABLE "tasks_labels"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_tasks_labels"
                RENAME TO "tasks_labels"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_77ad7bb1791d01e31999a717ac" ON "tasks_labels" ("tasks_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b3ffce2c889ab52554e560d31b" ON "tasks_labels" ("labels_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_b3ffce2c889ab52554e560d31b"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_77ad7bb1791d01e31999a717ac"
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks_labels"
                RENAME TO "temporary_tasks_labels"
        `);
        await queryRunner.query(`
            CREATE TABLE "tasks_labels" (
                "tasks_id" integer NOT NULL,
                "labels_id" integer NOT NULL,
                PRIMARY KEY ("tasks_id", "labels_id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "tasks_labels"("tasks_id", "labels_id")
            SELECT "tasks_id",
                "labels_id"
            FROM "temporary_tasks_labels"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_tasks_labels"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b3ffce2c889ab52554e560d31b" ON "tasks_labels" ("labels_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_77ad7bb1791d01e31999a717ac" ON "tasks_labels" ("tasks_id")
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_b3ffce2c889ab52554e560d31b"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_77ad7bb1791d01e31999a717ac"
        `);
        await queryRunner.query(`
            DROP TABLE "tasks_labels"
        `);
    }

}

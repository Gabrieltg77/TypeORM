import { MigrationInterface, QueryRunner } from "typeorm";

export class default1684850477401 implements MigrationInterface {
    name = 'default1684850477401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_match" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" date NOT NULL DEFAULT (CURRENT_TIMESTAMP), "host" integer, "idvisitor" integer, CONSTRAINT "fk_visitor_id" FOREIGN KEY ("idvisitor") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "fk_host_id" FOREIGN KEY ("host") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_match"("id", "date", "host", "idvisitor") SELECT "id", "date", "host", "idvisitor" FROM "match"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`ALTER TABLE "temporary_match" RENAME TO "match"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" RENAME TO "temporary_match"`);
        await queryRunner.query(`CREATE TABLE "match" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" date NOT NULL DEFAULT (CURRENT_TIMESTAMP), "name" varchar(30) NOT NULL, "host" integer, "idvisitor" integer, CONSTRAINT "UQ_2f3c9b3cae9716f98bc316e9e97" UNIQUE ("name"), CONSTRAINT "fk_visitor_id" FOREIGN KEY ("idvisitor") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "fk_host_id" FOREIGN KEY ("host") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "match"("id", "date", "host", "idvisitor") SELECT "id", "date", "host", "idvisitor" FROM "temporary_match"`);
        await queryRunner.query(`DROP TABLE "temporary_match"`);
    }

}

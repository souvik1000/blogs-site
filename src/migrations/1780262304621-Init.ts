import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1780262304621 implements MigrationInterface {
    name = 'Init1780262304621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blogs" ("id" SERIAL NOT NULL, "title" character varying(127) NOT NULL, "subtitle" character varying(255) NOT NULL, "content" text NOT NULL, "author" character varying(63) NOT NULL, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(48) NOT NULL, "email" character varying(64) NOT NULL, "bio" character varying(255), "password" character varying(32) NOT NULL, "profile_pic" character varying(64), "is_guest" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "product_id" integer NOT NULL DEFAULT '1', "status" character varying(48) NOT NULL, "amount" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '"2026-05-31T21:18:25.708Z"', "updated_at" TIMESTAMP NOT NULL DEFAULT '"2026-05-31T21:18:25.708Z"', CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
    }

}

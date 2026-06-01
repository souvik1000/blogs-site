import { MigrationInterface, QueryRunner } from "typeorm"

export class Init1780303477056 implements MigrationInterface {
    name = "Init1780303477056"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE INDEX "IDX_2d4a15c7f8b3864a5465fb687e" ON "users" ("name", "email") `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "public"."IDX_2d4a15c7f8b3864a5465fb687e"`,
        )
    }
}

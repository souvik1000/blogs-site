import { MigrationInterface, QueryRunner } from "typeorm"

export class Init1780298801979 implements MigrationInterface {
    name = "Init1780298801979"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE INDEX "IDX_a922b820eeef29ac1c6800e826" ON "orders" ("user_id") `,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "public"."IDX_a922b820eeef29ac1c6800e826"`,
        )
    }
}

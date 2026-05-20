import {
    Entity,
    Column,
    BeforeInsert,
    BeforeUpdate,
    PrimaryGeneratedColumn,
} from "typeorm"

@Entity("orders")
export class Orders {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column("integer", { nullable: false, name: "user_id" })
    userId: number

    // TODO: Remove default product Id after adding Products modal
    @Column("integer", { nullable: false, name: "product_id", default: 1 })
    productId: number

    @Column("varchar", { nullable: false, length: 48 })
    status: string

    @Column("decimal", { nullable: false, scale: 2 })
    amount: number

    @Column({ nullable: false, default: new Date(), name: "created_at" })
    createdAt: Date

    @Column({ nullable: false, default: new Date(), name: "updated_at" })
    updatedAt: Date

    @BeforeInsert()
    setCreatedAt() {
        const now = new Date()
        this.createdAt = now
        this.updatedAt = now
    }

    @BeforeUpdate()
    setUpdatedAt() {
        this.updatedAt = new Date()
    }
}

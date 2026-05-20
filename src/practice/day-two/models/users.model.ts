import {
    Entity,
    Column,
    BeforeInsert,
    BeforeUpdate,
    PrimaryGeneratedColumn,
} from "typeorm"

@Entity("users")
export class Users {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column("varchar", { nullable: false, length: 48 })
    name: string

    @Column("varchar", { nullable: false, unique: true, length: 64 })
    email: string

    @Column("varchar", { nullable: true, length: 255 })
    bio: string

    @Column("varchar", { nullable: false, length: 32 })
    password: string

    @Column("varchar", { nullable: true, name: "profile_pic", length: 64 })
    profilePic: string

    @Column({ nullable: false, default: false, name: "is_guest" })
    isGuest: boolean

    @Column({ nullable: false })
    createdAt: Date

    @Column({ nullable: false })
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

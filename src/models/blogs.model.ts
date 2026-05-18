import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("blogs")
export class Blog {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column("varchar", { length: 127 })
    title: string

    @Column("varchar", { length: 255, nullable: false })
    subtitle: string

    @Column("text")
    content: string

    @Column("varchar", { length: 63 })
    author: string
}

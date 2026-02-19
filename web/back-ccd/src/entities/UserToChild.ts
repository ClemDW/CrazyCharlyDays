import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { AgeRangeKey } from "./enums/AgeRange";

@Entity()
export class Usertochild extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id_user: string;

    @Column({
        type: "varchar",
        length: 10
    })
    age_range: AgeRangeKey;

    @Column("text", { array: true, nullable: true })
    preference: string[];
}
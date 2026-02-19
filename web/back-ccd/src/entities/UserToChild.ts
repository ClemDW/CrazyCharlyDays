import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { AgeRangeKey } from "./enums/AgeRange";

@Entity()
export class Usertochild extends BaseEntity {
    @PrimaryColumn("uuid")
    id_user: string;

    @Column({
        type: "varchar",
        length: 10
    })
    age_range: AgeRangeKey;

    @Column("text", { array: true, nullable: true })
    preference: string[];
}
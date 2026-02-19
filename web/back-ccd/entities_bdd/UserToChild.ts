import { UUID } from "node:crypto";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Double } from "typeorm";
import { AgeRange } from "./enums/AgeRange";


@Entity()
export class UserToChild extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id_user: UUID;

    @Column()
    age_range: AgeRange;

    @Column()
    preferences: Array<string>;
}
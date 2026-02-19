import { UUID } from "node:crypto";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Double } from "typeorm";
import { Role } from "./enums/Role";


@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id_user: UUID;

    @Column()
    name: string;

    @Column()
    family_name: string;

    @Column()
    email: string;

    @Column()
    role: Role;
}
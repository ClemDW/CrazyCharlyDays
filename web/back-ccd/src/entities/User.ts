import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { RoleKey } from "./enums/Role";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id_user: string;

    @Column()
    name: string;

    @Column()
    family_name: string;

    @Column({ unique: true })
    email: string;

    @Column({
        type: "varchar",
        length: 20,
        default: "USER"
    })
    role: RoleKey;
}
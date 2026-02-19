import { UUID } from "node:crypto";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Double } from "typeorm";


@Entity()
export class Box extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id_box: UUID;

    @Column()
    id_camp: UUID;

    @Column()
    id_user: UUID;

    @Column()
    score_box: number;

    @Column()
    total_weight: number;

    @Column()
    total_price: number;

    @Column()
    validated: boolean;
}
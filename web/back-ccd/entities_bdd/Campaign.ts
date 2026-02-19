import { UUID } from "node:crypto";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Double } from "typeorm";
import { StateCampaign } from "./enums/StateCampaign";


@Entity()
export class Campaign extends BaseEntity {
    @PrimaryGeneratedColumn("uuid") 
    id_camp: UUID;

    @Column()
    date: Date;

    @Column()
    max_weight: number;

    @Column()
    status: StateCampaign;

    @Column()
    total_weight: number;

    @Column()
    total_price: number;

    @Column()
    validated: boolean;
}
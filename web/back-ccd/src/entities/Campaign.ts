import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { StateCampaignKey } from "./enums/StateCampaign"; // Importe le type Key

@Entity()
export class Campaign extends BaseEntity {
    @PrimaryGeneratedColumn("uuid") 
    id_camp: string;

    @Column({ type: "timestamp" })
    date: Date;

    @Column("float")
    max_weight: number;

    @Column({
        type: "varchar",
        length: 20,
        default: "IN_PROGRESS"
    })
    status: StateCampaignKey; // Utilise la clé technique

    @Column("float", { default: 0 })
    total_weight: number;

    @Column("float", { default: 0 })
    total_price: number;

    @Column({ default: false })
    validated: boolean;

    @Column("float")
    min_price: number;

    @Column("float")
    max_price: number;
}
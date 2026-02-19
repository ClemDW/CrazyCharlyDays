import { UUID } from "node:crypto";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Double } from "typeorm";
import { Categories } from "./enums/Categories";
import { AgeRange } from "./enums/AgeRange";
import { State } from "./enums/State";


@Entity()
export class Article extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id_article: UUID;

    @Column()
    description: string;

    @Column()
    category: Categories;

    @Column()
    age_range: AgeRange;

    @Column()
    state: State;

    @Column()
    price: number;

    @Column()
    weight: number;

    @Column()
    id_box: UUID;
}
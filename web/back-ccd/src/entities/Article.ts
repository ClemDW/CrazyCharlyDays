// entities/Article.ts
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { CategoryKey } from "./enums/Categories";
import { AgeRangeKey } from "./enums/AgeRange";
import { StateKey } from "./enums/State";

@Entity()
export class Article extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id_article: string;

    @Column()
    description: string;

    @Column({ type: "varchar" })
    category: CategoryKey;

    @Column({ type: "varchar" })
    age_range: AgeRangeKey;
    @Column({ type: "varchar" })
    state: StateKey;

    @Column("float")
    price: number;

    @Column("float")
    weight: number;
}
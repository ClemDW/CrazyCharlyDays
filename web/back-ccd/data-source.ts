import "reflect-metadata";
import { DataSource } from "typeorm";
import { Article } from "./entities/Article";
import { Box } from "./entities/Box";
import { Campaign } from "./entities/Campaign";
import { User } from "./entities/User";
import { UserToChild } from "./entities/UserToChild";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: parseInt(process.env.DB_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    logging: true,
    entities: [Article, Box, Campaign, User, UserToChild],
    subscribers: [],
    migrations: [],
});
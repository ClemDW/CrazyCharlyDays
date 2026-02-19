import "reflect-metadata";

import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../.env") });

import { DataSource } from "typeorm";
import { Article } from "./entities/Article";
import { Box } from "./entities/Box";
import { Campaign } from "./entities/Campaign";
import { User } from "./entities/User";
import { Usertochild } from "./entities/UserToChild";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: parseInt(process.env.DB_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    logging: true,
    entities: [Article, Box, Campaign, User, Usertochild],
    subscribers: [],
    migrations: [],
});
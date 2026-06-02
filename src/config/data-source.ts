import * as dotenv from "dotenv"
import { DataSource } from "typeorm"

import migrations from "../migrations"
import { entities } from "../models/index.model"
import { userOrderEntities } from "../practice/day-two/models"

dotenv.config()
const isTest = process.env.NODE_ENV === "test"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? "",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: isTest ? "blogs_test" : (process.env.DB_NAME ?? ""),
    synchronize: isTest,
    logging: ["error"],
    logger: "file",
    // ssl: { rejectUnauthorized: false },
    entities: [...entities, ...userOrderEntities],
    subscribers: [],
    migrations: migrations,
})

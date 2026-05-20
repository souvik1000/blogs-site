import * as dotenv from "dotenv"
import { DataSource } from "typeorm"

import { entities } from "../models/index.model"
import { userOrderEntities } from "../practice/day-two/models"

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? "",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "",
    synchronize: true,
    logging: ["error"],
    logger: "file",
    ssl: { rejectUnauthorized: false },
    entities: [...entities, ...userOrderEntities],
    subscribers: [],
    migrations: [],
})

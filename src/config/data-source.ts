import * as dotenv from "dotenv"
import { DataSource } from "typeorm"

import { entities } from "../models/index.model"
import { userOrderEntities } from "../practice/day-two/models"
import { Init1780262304621 } from "../migrations/1780262304621-Init"
import { Init1780298801979 } from "../migrations/1780298801979-Init"

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? "",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "",
    // synchronize: true,
    logging: ["error"],
    logger: "file",
    // ssl: { rejectUnauthorized: false },
    entities: [...entities, ...userOrderEntities],
    subscribers: [],
    migrations: [Init1780262304621, Init1780298801979],
})

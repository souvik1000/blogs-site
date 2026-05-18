import { DataSource } from "typeorm"
import { entities } from "../models/index.model"
import * as dotenv from "dotenv"
dotenv.config()

// try {
//     if (typeof process.loadEnvFile === "function") {
//         process.loadEnvFile(path.resolve(process.cwd(), ".env"))
//     } else {
//         const fs = require("fs")
//         const envPath = path.resolve(process.cwd(), ".env")
//         if (fs.existsSync(envPath)) {
//             fs.readFileSync(envPath, "utf-8")
//                 .split("\n")
//                 .forEach((line: string) => {
//                     const trimmed = line.trim()
//                     if (!trimmed || trimmed.startsWith("#")) return
//                     const idx = trimmed.indexOf("=")
//                     if (idx === -1) return
//                     const key = trimmed.substring(0, idx).trim()
//                     let val = trimmed.substring(idx + 1).trim()
//                     if (
//                         (val.startsWith('"') && val.endsWith('"')) ||
//                         (val.startsWith("'") && val.endsWith("'"))
//                     ) {
//                         val = val.substring(1, val.length - 1)
//                     }
//                     process.env[key] = val
//                 })
//         }
//     }
// } catch (error) {
//     // Fall back to process.env or defaults
// }

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
    entities: entities,
    subscribers: [],
    migrations: [],
})

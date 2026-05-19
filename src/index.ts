import "reflect-metadata"
import express from "express"

import rootRouter from "./routes"
import { errorHandler } from "./utils/error"
import { AppDataSource } from "./config/data-source"
import studentRouter from "./practice/day-one-wodb/student.route"

const app = express()

app.use(express.json())

app.use("/api/v1", rootRouter)

// TODO: remove these routes after training
app.use("/api/v1/student", studentRouter)

app.use(errorHandler)

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!")

        app.listen(8080, () => {
            console.log("Server started on port 8080")
        })
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error)
    })

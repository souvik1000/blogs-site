import "reflect-metadata"
import express from "express"

import rootRouter from "./routes"
import { errorHandler } from "./utils/error"
import dayTwoRouter from "./practice/day-two/routes"
import studentRouter from "./practice/day-one-wodb/student.route"

const app = express()

app.use(express.json())

app.use("/api/v1", rootRouter)

// TODO: remove these routes after training
app.use("/api/v1/day-two", dayTwoRouter)
app.use("/api/v1/student", studentRouter)

app.use(errorHandler)

export default app

import { Router } from "express"

import blogsRouter from "./blogs.route"

const rootRouter = Router()

rootRouter.use("/blog", blogsRouter)

export default rootRouter

import { Router } from "express"
import userRouter from "./users.route"
import orderRouter from "./orders.route"

const router = Router()

router.use("/user", userRouter)
router.use("/order", orderRouter)

export default router

import { Router } from "express"

import {
    getOrder,
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrdersByUserId,
    createOrderByGuestUser,
} from "../controllers/order.controller"
import {
    createOrderSchema,
    updateOrderSchema,
    createGuestOrderSchema,
} from "../validations/order.validation"
import { validate } from "../../../middlewares/validation.middleware"

const router = Router()

router.get("/", getOrders)
router.get("/:id", getOrder)
router.delete("/:id", deleteOrder)
router.get("/user/:userId", getOrdersByUserId)
router.post("/", validate(createOrderSchema), createOrder)
router.put("/:id", validate(updateOrderSchema), updateOrder)
router.post("/guest-order", validate(createGuestOrderSchema), createOrderByGuestUser)

export default router

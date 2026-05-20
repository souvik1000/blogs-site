import { Router } from "express"

import {
    getUser,
    createUser,
    deleteUser,
    updateUser,
} from "../controllers/user.controller"
import { validate } from "../../../middlewares/validation.middleware"
import {
    createUserSchema,
    updateUserSchema,
} from "../validations/user.validation"

const router = Router()

router.get("/:id", getUser)
router.delete("/:id", deleteUser)
router.post("/", validate(createUserSchema), createUser)
router.put("/:id", validate(updateUserSchema), updateUser)

export default router

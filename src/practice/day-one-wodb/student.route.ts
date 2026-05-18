import { Router } from "express"

import {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    getStudentById,
} from "./index.controller"

const router = Router()

router.get("/", getStudents)
router.post("/", addStudent)
router.put("/:id", updateStudent)
router.get("/:id", getStudentById)
router.delete("/:id", deleteStudent)

export default router

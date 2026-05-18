import { Router } from "express"

import {
    getBlog,
    getBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
} from "../controllers/blogs.controller"

const router = Router()

router.get("/", getBlogs)
router.get("/:id", getBlog)
router.post("/", createBlog)
router.put("/:id", updateBlog)
router.delete("/:id", deleteBlog)

export default router

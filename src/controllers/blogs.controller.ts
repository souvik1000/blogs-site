import { Request, Response } from "express"

import { ILike } from "typeorm"
import { Blog } from "../models/blogs.model"
import { getPagination } from "../utils/pagination"
import { AppDataSource } from "../config/data-source"

const blogRepository = AppDataSource.getRepository(Blog)

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
    const { limit, page, search } = req.query ?? {}

    let pageVal = Number(page) || 1
    let limitVal = Number(limit) || 5
    const searchVal = ((search as string) ?? "").toLowerCase()

    const { skip, take } = getPagination(pageVal, limitVal)

    // TODO: Used TypeORM query builder instead of find() method.
    // const blogs = await blogRepository.find({
    //     where: searchVal
    //         ? {
    //               title: ILike(`%${searchVal}%`),
    //           }
    //         : {},
    //     skip,
    //     take,
    // })

    const [blogs, totalBlogs] = await blogRepository
        .createQueryBuilder("blog")
        .limit(take)
        .offset(skip)
        .where("blog.title ILIKE :title", { title: `%${searchVal}%` })
        .getManyAndCount()

    const totalPages = Math.ceil(totalBlogs / limitVal)
    const prevPage = pageVal > 1 && pageVal <= totalPages ? pageVal - 1 : null
    const nextPage = pageVal < totalPages ? pageVal + 1 : null

    res.json({
        message: "All blogs fetched successfully.",
        data: blogs,
        meta: {
            page: pageVal,
            prevPage,
            nextPage,
            limit: limitVal,
            totalPages,
            totalBlogs,
        },
    })
}

export const getBlog = async (req: Request, res: Response): Promise<void> => {
    // TODO: Used TypeORM query builder instead of find() method.
    // const blog = await blogRepository.findOneBy({ id: Number(req.params.id) })

    const blog = await blogRepository
        .createQueryBuilder("blog")
        .where("blog.id = :id", { id: Number(req.params.id) })
        .getOne()

    if (!blog) {
        res.status(404).json({ message: "Blog not found." })
        return
    }

    res.json({ message: "Blog fetched successfully", data: blog })
}

export const createBlog = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { title, subtitle, content, author } = req.body ?? {}

    if (!title || !content || !author) {
        res.status(400).json({
            message: "Title, content, and author are required",
        })
        return
    }

    const isBlogExists = await blogRepository
        .createQueryBuilder("blog")
        .where("blog.title = :title", { title })
        .getOne()

    if (isBlogExists) {
        res.status(400).json({ message: "Blog already exists" })
        return
    }

    // TODO: Used TypeORM query builder instead of save() method.
    // const blog = await blogRepository.save({
    //     title,
    //     author,
    //     content,
    //     subtitle: subtitle || "",
    // })

    const blog = await blogRepository
        .createQueryBuilder()
        .insert()
        .into(Blog)
        .values({
            title,
            author,
            content,
            subtitle: subtitle || "",
        })
        .execute()

    res.json({ message: "Blog is created successfully.", data: blog })
}

export const updateBlog = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params ?? {}
    const { title, subtitle, content, author } = req.body ?? {}

    // TODO: Used TypeORM query builder instead of save() method.
    // const blog = await blogRepository.findOneBy({
    //     id: Number(id),
    // })

    const blog = await blogRepository
        .createQueryBuilder("blog")
        .where("blog.id = :id", { id: Number(id) })
        .getOne()

    if (!blog) {
        res.status(404).json({ message: "Blog not found" })
        return
    }

    blog.title = title ?? blog.title
    blog.author = author ?? blog.author
    blog.content = content ?? blog.content
    blog.subtitle = subtitle ?? blog.subtitle

    // TODO: Used TypeORM query builder instead of save() method.
    // await blogRepository.save(blog)

    await blogRepository
        .createQueryBuilder()
        .update(Blog)
        .set({ ...blog })
        .where("blog.id = :id", { id })
        .execute()

    res.json({ message: "Blog updated successfully", data: blog })
}

export const deleteBlog = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const id = parseInt(req?.params?.id as string)
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid blog ID" })
            return
        }

        // TODO: Used TypeORM query builder instead of delete() method.
        // const deleteResult = await blogRepository.delete(id)

        const deleteResult = await blogRepository
            .createQueryBuilder()
            .delete()
            .from(Blog)
            .where("blog.id = :id", { id })
            .execute()

        if (deleteResult.affected === 0) {
            res.status(404).json({ message: "Blog not found" })
            return
        }
        res.json({ message: "Blog deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error })
    }
}

import request from "supertest"
import { StatusCode } from "../enums/statusCode"
import { mockQueryBuilder, mockRepository } from "../utils/test-mocks"
import {
    mockBlog,
    mockBlogInputMissingFields,
    mockBlogInputDuplicate,
    mockBlogInputCreate,
    mockBlogInputUpdateNotFound,
    mockBlogInputUpdate,
    mockBlogExecuteResult,
    mockBlogExecuteUpdateResult,
    mockBlogExecuteDeleteNotFound,
} from "../constants/test.constant"

import app from "../app"

describe("Blogs API Endpoints", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("GET /api/v1/blog", () => {
        it("should fetch all blogs with pagination", async () => {
            mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([
                [mockBlog],
                1,
            ])

            const res = await request(app)
                .get("/api/v1/blog")
                .query({ page: 1, limit: 5, search: "Test" })

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.message).toBe("All blogs fetched successfully.")
            expect(res.body.data).toEqual([mockBlog])
            expect(res.body.meta).toEqual({
                page: 1,
                prevPage: null,
                nextPage: null,
                limit: 5,
                totalPages: 1,
                totalBlogs: 1,
            })
            expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
                "blog",
            )
            expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5)
            expect(mockQueryBuilder.offset).toHaveBeenCalledWith(0)
            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                "blog.title ILIKE :title",
                { title: "%test%" },
            )
        })
    })

    describe("GET /api/v1/blog/:id", () => {
        it("should fetch a single blog by ID", async () => {
            mockQueryBuilder.getOne.mockResolvedValueOnce(mockBlog)

            const res = await request(app).get("/api/v1/blog/1")

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.message).toBe("Blog fetched successfully")
            expect(res.body.data).toEqual(mockBlog)
            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                "blog.id = :id",
                { id: 1 },
            )
        })

        it("should return 404 if blog is not found", async () => {
            mockQueryBuilder.getOne.mockResolvedValueOnce(null)

            const res = await request(app).get("/api/v1/blog/999")

            expect(res.status).toBe(StatusCode.NOT_FOUND)
            expect(res.body.message).toBe("Blog not found.")
        })
    })

    describe("POST /api/v1/blog", () => {
        it("should fail to create a blog if required fields are missing", async () => {
            const res = await request(app)
                .post("/api/v1/blog")
                .send(mockBlogInputMissingFields)

            expect(res.status).toBe(StatusCode.BAD_REQUEST)
            expect(res.body.message).toBe(
                "Title, content, and author are required.",
            )
        })

        it("should fail to create a blog if a blog with the same title exists", async () => {
            mockQueryBuilder.getOne.mockResolvedValueOnce(mockBlog) // Already exists

            const res = await request(app)
                .post("/api/v1/blog")
                .send(mockBlogInputDuplicate)

            expect(res.status).toBe(StatusCode.BAD_REQUEST)
            expect(res.body.message).toBe("Blog already exists.")
        })

        it("should create a blog successfully", async () => {
            mockQueryBuilder.getOne.mockResolvedValueOnce(null) // Doesn't exist
            mockQueryBuilder.execute.mockResolvedValueOnce(
                mockBlogExecuteResult,
            )

            const res = await request(app)
                .post("/api/v1/blog")
                .send(mockBlogInputCreate)

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.message).toBe("Blog is created successfully.")
            expect(mockQueryBuilder.values).toHaveBeenCalledWith({
                title: "Brand New Blog",
                author: "Creative Writer",
                content: "Very interesting content",
                subtitle: "Subby",
            })
        })
    })

    describe("PUT /api/v1/blog/:id", () => {
        it("should return 404 when updating a non-existent blog", async () => {
            mockQueryBuilder.getOne.mockResolvedValueOnce(null)

            const res = await request(app)
                .put("/api/v1/blog/999")
                .send(mockBlogInputUpdateNotFound)

            expect(res.status).toBe(StatusCode.NOT_FOUND)
            expect(res.body.message).toBe("Blog not found.")
        })

        it("should update a blog successfully", async () => {
            mockQueryBuilder.getOne.mockResolvedValueOnce({ ...mockBlog })
            mockQueryBuilder.execute.mockResolvedValueOnce(
                mockBlogExecuteUpdateResult,
            )

            const res = await request(app)
                .put("/api/v1/blog/1")
                .send(mockBlogInputUpdate)

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.message).toBe("Blog updated successfully")
            expect(res.body.data.title).toBe("Totally New Title")
            expect(res.body.data.content).toBe("Updated Content")
            expect(res.body.data.author).toBe("Test Author") // Unchanged
            expect(mockQueryBuilder.set).toHaveBeenCalledWith({
                id: 1,
                title: "Totally New Title",
                subtitle: "Test Subtitle",
                content: "Updated Content",
                author: "Test Author",
            })
        })
    })

    describe("DELETE /api/v1/blog/:id", () => {
        it("should return 400 for an invalid ID", async () => {
            const res = await request(app).delete("/api/v1/blog/not-an-integer")

            expect(res.status).toBe(StatusCode.BAD_REQUEST)
            expect(res.body.message).toBe("Invalid blog ID.")
        })

        it("should return 404 if blog is not found during delete", async () => {
            mockQueryBuilder.execute.mockResolvedValueOnce(
                mockBlogExecuteDeleteNotFound,
            )

            const res = await request(app).delete("/api/v1/blog/999")

            expect(res.status).toBe(StatusCode.NOT_FOUND)
            expect(res.body.message).toBe("Blog not found.")
        })

        it("should delete a blog successfully", async () => {
            mockQueryBuilder.execute.mockResolvedValueOnce(
                mockBlogExecuteUpdateResult,
            )

            const res = await request(app).delete("/api/v1/blog/1")

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.message).toBe("Blog deleted successfully")
            expect(mockQueryBuilder.delete).toHaveBeenCalled()
        })
    })
})

import request from "supertest"

import {
    mockRepository as mockUserRepository,
    mockQueryBuilder as mockUserQueryBuilder,
} from "../../../utils/test-mocks"
import {
    mockUser,
    mockUserCreateInput,
    mockUserExecuteResult,
    mockUserUpdateNameInput,
    mockInvalidUserCreateInput,
    mockInvalidUserUpdateInput,
    mockUserUpdateSuccessInput,
} from "../../../constants/test.constant"
import { StatusCode } from "../../../enums/statusCode"

import app from "../../../app"

describe("Users API Endpoints", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("GET /api/v1/day-two/user/:id", () => {
        it("should fetch a single user successfully", async () => {
            mockUserQueryBuilder.getOne.mockResolvedValueOnce(mockUser)

            const res = await request(app).get("/api/v1/day-two/user/1")

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("User fetched successfully")
            expect(res.body.data).toEqual(JSON.parse(JSON.stringify(mockUser)))
            expect(mockUserQueryBuilder.where).toHaveBeenCalledWith(
                "users.id = :id",
                { id: "1" },
            )
        })

        it("should return 404 if user is not found", async () => {
            mockUserQueryBuilder.getOne.mockResolvedValueOnce(null)

            const res = await request(app).get("/api/v1/day-two/user/999")

            expect(res.status).toBe(StatusCode.NOT_FOUND)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe("User not found")
        })
    })

    describe("POST /api/v1/day-two/user", () => {
        it("should fail validation on creation if details are missing or invalid", async () => {
            const res = await request(app)
                .post("/api/v1/day-two/user")
                .send(mockInvalidUserCreateInput)

            expect(res.status).toBe(StatusCode.BAD_REQUEST)
            expect(res.body.success).toBe(false)
        })

        it("should create user successfully with valid inputs", async () => {
            mockUserQueryBuilder.execute.mockResolvedValueOnce(
                mockUserExecuteResult,
            )

            const res = await request(app)
                .post("/api/v1/day-two/user")
                .send(mockUserCreateInput)

            expect(res.status).toBe(StatusCode.CREATED)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("User created successfully")
            expect(res.body.data.name).toBe("Jane Doe")
            expect(mockUserRepository.create).toHaveBeenCalled()
        })
    })

    describe("PUT /api/v1/day-two/user/:id", () => {
        it("should fail update validation with invalid values", async () => {
            const res = await request(app)
                .put("/api/v1/day-two/user/1")
                .send(mockInvalidUserUpdateInput)

            expect(res.status).toBe(StatusCode.BAD_REQUEST)
        })

        it("should return 404 when updating non-existent user", async () => {
            mockUserQueryBuilder.getOne.mockResolvedValueOnce(null)

            const res = await request(app)
                .put("/api/v1/day-two/user/999")
                .send(mockUserUpdateNameInput)

            expect(res.status).toBe(StatusCode.NOT_FOUND)
            expect(res.body.message).toBe("User not found")
        })

        it("should update user successfully", async () => {
            mockUserQueryBuilder.getOne.mockResolvedValueOnce(mockUser)
            mockUserQueryBuilder.execute.mockResolvedValueOnce(
                mockUserExecuteResult,
            )

            const res = await request(app)
                .put("/api/v1/day-two/user/1")
                .send(mockUserUpdateSuccessInput)

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("User updated successfully")
        })
    })

    describe("DELETE /api/v1/day-two/user/:id", () => {
        it("should delete user successfully", async () => {
            mockUserQueryBuilder.execute.mockResolvedValueOnce({ affected: 1 })

            const res = await request(app).delete("/api/v1/day-two/user/1")

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("User deleted successfully")
        })
    })
})

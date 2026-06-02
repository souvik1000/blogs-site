import request from "supertest"
import { StatusCode } from "../../../enums/statusCode"
import {
    mockQueryBuilder as mockUserQueryBuilder,
    mockQueryBuilder as mockOrderQueryBuilder,
    mockRepository as mockOrderRepository,
    mockEntityManager,
} from "../../../utils/test-mocks"
import {
    mockOrder,
    mockOrderInput,
    mockOrderInputNonExistentUser,
    mockInvalidOrderInput,
    mockOrderUpdateInput,
    mockUpdatedOrderResponse,
    mockGuestOrderInput,
    mockUserResponse,
    mockGuestUserResponse,
    mockOrderExecuteResult,
} from "../../../constants/test.constant"

import app from "../../../app"

describe("Orders API Endpoints", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("GET /api/v1/day-two/order", () => {
        it("should fetch all orders with pagination", async () => {
            mockOrderQueryBuilder.getManyAndCount.mockResolvedValueOnce([
                [mockOrder],
                1,
            ])

            const res = await request(app)
                .get("/api/v1/day-two/order")
                .query({ userId: 1, page: 1, limit: 5 })

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.message).toBe("All orders fetched successfully.")
            expect(res.body.data).toEqual([
                JSON.parse(JSON.stringify(mockOrder)),
            ])
            expect(res.body.meta).toEqual({
                page: 1,
                prevPage: null,
                nextPage: null,
                limit: 5,
                totalPages: 1,
                totalOrders: 1,
            })
        })
    })

    describe("GET /api/v1/day-two/order/:id", () => {
        it("should return 400 if userId is missing in query", async () => {
            const res = await request(app).get("/api/v1/day-two/order/1")
            expect(res.status).toBe(StatusCode.BAD_REQUEST)
        })

        it("should fetch an order successfully", async () => {
            mockOrderQueryBuilder.getOne.mockResolvedValueOnce(mockOrder)

            const res = await request(app)
                .get("/api/v1/day-two/order/1")
                .query({ userId: 1 })

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.data).toEqual(JSON.parse(JSON.stringify(mockOrder)))
        })

        it("should return 404 if order is not found", async () => {
            mockOrderQueryBuilder.getOne.mockResolvedValueOnce(null)

            const res = await request(app)
                .get("/api/v1/day-two/order/999")
                .query({ userId: 1 })

            expect(res.status).toBe(StatusCode.NOT_FOUND)
        })
    })

    describe("POST /api/v1/day-two/order", () => {
        it("should fail validation with invalid order payload", async () => {
            const res = await request(app)
                .post("/api/v1/day-two/order")
                .send(mockInvalidOrderInput)

            expect(res.status).toBe(StatusCode.BAD_REQUEST)
        })

        it("should return 404 if user doesn't exist", async () => {
            mockUserQueryBuilder.getOne.mockResolvedValueOnce(null) // User not found

            const res = await request(app)
                .post("/api/v1/day-two/order")
                .send(mockOrderInputNonExistentUser)

            expect(res.status).toBe(StatusCode.NOT_FOUND)
            expect(res.body.message).toBe("User with ID 999 not found")
        })

        it("should place order successfully", async () => {
            mockUserQueryBuilder.getOne.mockResolvedValueOnce(mockUserResponse) // User exists
            mockOrderQueryBuilder.execute.mockResolvedValueOnce(
                mockOrderExecuteResult,
            )

            const res = await request(app)
                .post("/api/v1/day-two/order")
                .send(mockOrderInput)

            expect(res.status).toBe(StatusCode.CREATED)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("Order placed successfully")
        })
    })

    describe("PUT /api/v1/day-two/order/:id", () => {
        it("should update order successfully", async () => {
            mockOrderQueryBuilder.getOne.mockResolvedValueOnce({ ...mockOrder })
            mockOrderRepository.save.mockResolvedValueOnce(
                mockUpdatedOrderResponse,
            )

            const res = await request(app)
                .put("/api/v1/day-two/order/1")
                .send(mockOrderUpdateInput)

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.data.status).toBe("completed")
        })
    })

    describe("POST /api/v1/day-two/order/guest-order", () => {
        it("should place a guest order successfully, creating a new guest user", async () => {
            mockEntityManager.findOne.mockResolvedValueOnce(null) // User doesn't exist

            const res = await request(app)
                .post("/api/v1/day-two/order/guest-order")
                .send(mockGuestOrderInput)

            expect(res.status).toBe(StatusCode.CREATED)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("Order placed successfully")
            expect(mockEntityManager.findOne).toHaveBeenCalled()
            expect(mockEntityManager.create).toHaveBeenCalledTimes(2) // 1 for User, 1 for Order
            expect(mockEntityManager.save).toHaveBeenCalledTimes(2)
        })

        it("should place a guest order successfully using an existing user", async () => {
            mockEntityManager.findOne.mockResolvedValueOnce(
                mockGuestUserResponse,
            ) // User exists

            const res = await request(app)
                .post("/api/v1/day-two/order/guest-order")
                .send(mockGuestOrderInput)

            expect(res.status).toBe(StatusCode.CREATED)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("Order placed successfully")
            expect(mockEntityManager.findOne).toHaveBeenCalled()
            expect(mockEntityManager.create).toHaveBeenCalledTimes(1) // only 1 for Order, none for User
            expect(mockEntityManager.save).toHaveBeenCalledTimes(1)
        })
    })
})

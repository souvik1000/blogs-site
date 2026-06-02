import request from "supertest"
import { Users } from "../models/users.model"
import { Orders } from "../models/orders.model"
import { StatusCode } from "../../../enums/statusCode"
import { AppDataSource } from "../../../config/data-source"
import app from "../../../app"

describe("Orders API Endpoints", () => {
    let userRepository: any
    let orderRepository: any

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize()
        }
        userRepository = AppDataSource.getRepository(Users)
        orderRepository = AppDataSource.getRepository(Orders)
    })

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy()
        }
    })

    beforeEach(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize()
        }
        const entities = AppDataSource.entityMetadatas
        for (const entity of entities) {
            const repository = AppDataSource.getRepository(entity.name)
            await repository.query(
                `TRUNCATE TABLE "${entity.tableName}" CASCADE;`,
            )
        }
    })

    describe("GET /api/v1/day-two/order", () => {
        it("should fetch all orders with pagination", async () => {
            const user = userRepository.create({
                name: "Order User",
                email: "orderuser@example.com",
                password: "password123",
                isGuest: false,
            })
            const savedUser = await userRepository.save(user)

            const order = orderRepository.create({
                userId: savedUser.id,
                productId: 2,
                status: "pending",
                amount: 99.99,
            })
            const savedOrder = await orderRepository.save(order)

            const res = await request(app)
                .get("/api/v1/day-two/order")
                .query({ userId: savedUser.id, page: 1, limit: 5 })

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.message).toBe("All orders fetched successfully.")
            expect(res.body.data[0].id).toBe(savedOrder.id)
            expect(res.body.data[0].userId).toBe(savedUser.id)
            expect(res.body.data[0].status).toBe("pending")
            expect(parseFloat(res.body.data[0].amount)).toBe(99.99)
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
            const user = userRepository.create({
                name: "Order User",
                email: "orderuser@example.com",
                password: "password123",
                isGuest: false,
            })
            const savedUser = await userRepository.save(user)

            const order = orderRepository.create({
                userId: savedUser.id,
                productId: 2,
                status: "pending",
                amount: 99.99,
            })
            const savedOrder = await orderRepository.save(order)

            const res = await request(app)
                .get(`/api/v1/day-two/order/${savedOrder.id}`)
                .query({ userId: savedUser.id })

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.data.id).toBe(savedOrder.id)
            expect(res.body.data.userId).toBe(savedUser.id)
            expect(parseFloat(res.body.data.amount)).toBe(99.99)
        })

        it("should return 404 if order is not found", async () => {
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
                .send({ amount: -10 })

            expect(res.status).toBe(StatusCode.BAD_REQUEST)
        })

        it("should return 404 if user doesn't exist", async () => {
            const res = await request(app).post("/api/v1/day-two/order").send({
                userId: 999,
                status: "pending",
                amount: 50.0,
            })

            expect(res.status).toBe(StatusCode.NOT_FOUND)
            expect(res.body.message).toBe("User with ID 999 not found")
        })

        it("should place order successfully", async () => {
            const user = userRepository.create({
                name: "Order User",
                email: "orderuser@example.com",
                password: "password123",
                isGuest: false,
            })
            const savedUser = await userRepository.save(user)

            const res = await request(app).post("/api/v1/day-two/order").send({
                userId: savedUser.id,
                status: "pending",
                amount: 50.0,
            })

            expect(res.status).toBe(StatusCode.CREATED)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("Order placed successfully")
        })
    })

    describe("PUT /api/v1/day-two/order/:id", () => {
        it("should update order successfully", async () => {
            const user = userRepository.create({
                name: "Order User",
                email: "orderuser@example.com",
                password: "password123",
                isGuest: false,
            })
            const savedUser = await userRepository.save(user)

            const order = orderRepository.create({
                userId: savedUser.id,
                productId: 2,
                status: "pending",
                amount: 99.99,
            })
            const savedOrder = await orderRepository.save(order)

            const res = await request(app)
                .put(`/api/v1/day-two/order/${savedOrder.id}`)
                .send({
                    userId: savedUser.id,
                    status: "completed",
                    amount: 99.99,
                })

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.data.status).toBe("completed")
        })
    })

    describe("POST /api/v1/day-two/order/guest-order", () => {
        it("should place a guest order successfully, creating a new guest user", async () => {
            const res = await request(app)
                .post("/api/v1/day-two/order/guest-order")
                .send({
                    firstName: "Guest",
                    lastName: "User",
                    email: "guest@example.com",
                    status: "pending",
                    amount: 120.0,
                })

            expect(res.status).toBe(StatusCode.CREATED)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("Order placed successfully")

            // Verify database entries
            const guestUser = await userRepository.findOneBy({
                email: "guest@example.com",
            })
            expect(guestUser).toBeDefined()
            expect(guestUser.name).toBe("Guest User")
            expect(guestUser.isGuest).toBe(true)

            const guestOrder = await orderRepository.findOneBy({
                userId: guestUser.id,
            })
            expect(guestOrder).toBeDefined()
            expect(parseFloat(guestOrder.amount)).toBe(120.0)
        })

        it("should place a guest order successfully using an existing user", async () => {
            const guestUser = userRepository.create({
                name: "Guest User",
                email: "guest@example.com",
                password: "guestPassword",
                isGuest: true,
            })
            const savedGuestUser = await userRepository.save(guestUser)

            const res = await request(app)
                .post("/api/v1/day-two/order/guest-order")
                .send({
                    firstName: "Guest",
                    lastName: "User",
                    email: "guest@example.com",
                    status: "pending",
                    amount: 120.0,
                })

            expect(res.status).toBe(StatusCode.CREATED)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("Order placed successfully")

            // Verify order created for same user
            const guestOrders = await orderRepository.findBy({
                userId: savedGuestUser.id,
            })
            expect(guestOrders.length).toBe(1)
            expect(parseFloat(guestOrders[0].amount)).toBe(120.0)
        })
    })
})

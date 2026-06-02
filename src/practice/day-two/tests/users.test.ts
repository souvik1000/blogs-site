import request from "supertest"
import { Users } from "../models/users.model"
import { StatusCode } from "../../../enums/statusCode"
import { AppDataSource } from "../../../config/data-source"
import app from "../../../app"

describe("Users API Endpoints", () => {
    let userRepository: any

    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize()
        }
        userRepository = AppDataSource.getRepository(Users)
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

    describe("GET /api/v1/day-two/user/:id", () => {
        it("should fetch a single user successfully", async () => {
            const user = userRepository.create({
                name: "Test User",
                email: "testuser@example.com",
                password: "password123",
                bio: "Hello World",
                profilePic: "pic.jpg",
                isGuest: false,
            })
            const savedUser = await userRepository.save(user)

            const res = await request(app).get(
                `/api/v1/day-two/user/${savedUser.id}`,
            )

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("User fetched successfully")
            expect(res.body.data.id).toBe(savedUser.id)
            expect(res.body.data.name).toBe("Test User")
            expect(res.body.data.email).toBe("testuser@example.com")
            expect(res.body.data.bio).toBe("Hello World")
            expect(res.body.data.profilePic).toBe("pic.jpg")
            expect(res.body.data.isGuest).toBe(false)
        })

        it("should return 404 if user is not found", async () => {
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
                .send({ name: "Ab" }) // Invalid details (no email/password, etc.)

            expect(res.status).toBe(StatusCode.BAD_REQUEST)
            expect(res.body.success).toBe(false)
        })

        it("should create user successfully with valid inputs", async () => {
            const res = await request(app).post("/api/v1/day-two/user").send({
                name: "Jane Doe",
                email: "janedoe@example.com",
                password: "Password123!",
                bio: "Artist",
                isGuest: false,
            })

            expect(res.status).toBe(StatusCode.CREATED)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("User created successfully")
            expect(res.body.data.name).toBe("Jane Doe")
            expect(res.body.data.email).toBe("janedoe@example.com")

            // Verify in DB
            const checkUser = await userRepository.findOneBy({
                email: "janedoe@example.com",
            })
            expect(checkUser).toBeDefined()
            expect(checkUser.name).toBe("Jane Doe")
        })
    })

    describe("PUT /api/v1/day-two/user/:id", () => {
        it("should fail update validation with invalid values", async () => {
            const user = userRepository.create({
                name: "Test User",
                email: "testuser@example.com",
                password: "password123",
                isGuest: false,
            })
            const savedUser = await userRepository.save(user)

            const res = await request(app)
                .put(`/api/v1/day-two/user/${savedUser.id}`)
                .send({ email: "invalid-email" })

            expect(res.status).toBe(StatusCode.BAD_REQUEST)
        })

        it("should return 404 when updating non-existent user", async () => {
            const res = await request(app)
                .put("/api/v1/day-two/user/999")
                .send({ name: "New Name" })

            expect(res.status).toBe(StatusCode.NOT_FOUND)
            expect(res.body.message).toBe("User not found")
        })

        it("should update user successfully", async () => {
            const user = userRepository.create({
                name: "Test User",
                email: "testuser@example.com",
                password: "password123",
                isGuest: false,
            })
            const savedUser = await userRepository.save(user)

            const res = await request(app)
                .put(`/api/v1/day-two/user/${savedUser.id}`)
                .send({ name: "Updated User Name" })

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("User updated successfully")

            // Verify in DB
            const checkUser = await userRepository.findOneBy({
                id: savedUser.id,
            })
            expect(checkUser.name).toBe("Updated User Name")
        })
    })

    describe("DELETE /api/v1/day-two/user/:id", () => {
        it("should delete user successfully", async () => {
            const user = userRepository.create({
                name: "Test User",
                email: "testuser@example.com",
                password: "password123",
                isGuest: false,
            })
            const savedUser = await userRepository.save(user)

            const res = await request(app).delete(
                `/api/v1/day-two/user/${savedUser.id}`,
            )

            expect(res.status).toBe(StatusCode.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe("User deleted successfully")

            // Verify in DB
            const checkUser = await userRepository.findOneBy({
                id: savedUser.id,
            })
            expect(checkUser).toBeNull()
        })
    })
})

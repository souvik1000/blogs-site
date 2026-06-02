import request from "supertest"
import app from "../app"
import { StatusCode } from "../enums/statusCode"
import {
    mockStudentInputMissingFields,
    mockStudentCreateInput,
    mockStudentCreateResponse,
    mockStudentDuplicateInput,
    mockStudentUpdateInput,
    mockStudentUpdateNotFoundInput,
    mockJaneStudentInput,
} from "../constants/test.constant"

describe("Student API Endpoints", () => {
    it("should return empty list initially", async () => {
        const res = await request(app).get("/api/v1/student")
        expect(res.status).toBe(StatusCode.OK)
        expect(res.body.message).toBe("All students fetched successfully")
        expect(res.body.data).toEqual([])
        expect(res.body.meta.totalCount).toBe(0)
    })

    it("should fail to create a student with missing fields", async () => {
        const res = await request(app)
            .post("/api/v1/student")
            .send(mockStudentInputMissingFields)

        expect(res.status).toBe(StatusCode.BAD_REQUEST)
        expect(res.body.message).toBe("Invalid student data.")
    })

    it("should create a student successfully", async () => {
        const res = await request(app)
            .post("/api/v1/student")
            .send(mockStudentCreateInput)

        expect(res.status).toBe(StatusCode.CREATED)
        expect(res.body.message).toBe("Student added successfully")
        expect(res.body.data).toEqual(mockStudentCreateResponse)
    })

    it("should fail to create a duplicate student", async () => {
        const res = await request(app)
            .post("/api/v1/student")
            .send(mockStudentDuplicateInput)

        expect(res.status).toBe(StatusCode.CONFLICT)
        expect(res.body.message).toBe("Student already exists.")
    })

    it("should fetch a student by ID", async () => {
        const res = await request(app).get("/api/v1/student/1")
        expect(res.status).toBe(StatusCode.OK)
        expect(res.body.message).toBe("Student fetched successfully")
        expect(res.body.data.name).toBe("John Doe")
    })

    it("should return 404 for non-existent student ID", async () => {
        const res = await request(app).get("/api/v1/student/999")
        expect(res.status).toBe(StatusCode.NOT_FOUND)
        expect(res.body.message).toBe("Student not found.")
    })

    it("should update student successfully", async () => {
        const res = await request(app)
            .put("/api/v1/student/1")
            .send(mockStudentUpdateInput)

        expect(res.status).toBe(StatusCode.CREATED)
        expect(res.body.message).toBe("Student updated successfully")
        expect(res.body.data.name).toBe("John Doe Updated")
        expect(res.body.data.isPlaced).toBe(true)
        expect(res.body.data.age).toBe(20) // unchanged
    })

    it("should return 404 when updating non-existent student", async () => {
        const res = await request(app)
            .put("/api/v1/student/999")
            .send(mockStudentUpdateNotFoundInput)

        expect(res.status).toBe(StatusCode.NOT_FOUND)
        expect(res.body.message).toBe("Student not found.")
    })

    it("should return paginated and searched list of students", async () => {
        // Let's create another student first
        await request(app).post("/api/v1/student").send(mockJaneStudentInput)

        const res = await request(app)
            .get("/api/v1/student")
            .query({ search: "Jane", page: 1, limit: 5 })

        expect(res.status).toBe(StatusCode.OK)
        expect(res.body.data.length).toBe(1)
        expect(res.body.data[0].name).toBe("Jane Smith")
        expect(res.body.meta.totalCount).toBe(1)
    })

    it("should delete student successfully", async () => {
        const res = await request(app).delete("/api/v1/student/1")
        expect(res.status).toBe(StatusCode.OK)
        expect(res.body.message).toBe("Student deleted successfully")
        expect(res.body.data.name).toBe("John Doe Updated")

        // Verifying it is removed
        const checkRes = await request(app).get("/api/v1/student/1")
        expect(checkRes.status).toBe(StatusCode.NOT_FOUND)
    })

    it("should return 404 when deleting non-existent student", async () => {
        const res = await request(app).delete("/api/v1/student/999")
        expect(res.status).toBe(StatusCode.NOT_FOUND)
        expect(res.body.message).toBe("Student not found.")
    })
})

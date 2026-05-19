import { Request, Response } from "express"

import { Student } from "./student.model"
import { StatusCode } from "../../enums/statusCode"
import { AppError, asyncHandler } from "../../utils/error"
import { ErrorConstant } from "../../constants/error.constant"

const students: Student[] = []

export const getStudents = asyncHandler((req: Request, res: Response) => {
    const { limit, page, search } = req.query ?? {}

    let pageVal = Number(page) || 1
    let limitVal = Number(limit) || 5

    const searchVal = ((search as string) ?? "").toLowerCase()
    const filteredStudents = students.filter(
        (student) =>
            student.id.toString().includes(searchVal) ||
            student.name.toLowerCase().includes(searchVal) ||
            student.age.toString().includes(searchVal) ||
            student.cgpa.toString().includes(searchVal) ||
            (student.isPlaced ? "true" : "false").includes(searchVal),
    )

    const limitedStudents = filteredStudents.slice(
        limitVal * (pageVal - 1),
        limitVal * pageVal,
    )

    const totalPages = Math.ceil(filteredStudents.length / limitVal)
    const nextPage = pageVal < totalPages ? pageVal + 1 : null
    const prevPage = pageVal > 1 && pageVal <= totalPages ? pageVal - 1 : null

    res.status(StatusCode.OK).json({
        message: "All students fetched successfully",
        data: limitedStudents,
        meta: {
            prevPage,
            nextPage,
            totalPages,
            page: pageVal,
            limit: limitVal,
            totalCount: filteredStudents.length,
        },
    })
})

export const getStudentById = asyncHandler((req: Request, res: Response) => {
    const { id } = req.params ?? {}

    if (!id) {
        throw new AppError(
            StatusCode.BAD_REQUEST,
            ErrorConstant.STUDENT_ID_REQUIRED,
        )
    }

    const student = students.find((student) => student.id === Number(id))

    if (!student) {
        throw new AppError(
            StatusCode.NOT_FOUND,
            ErrorConstant.STUDENT_NOT_FOUND,
        )
    }

    res.status(StatusCode.OK).json({
        message: "Student fetched successfully",
        data: student,
    })
})

export const addStudent = asyncHandler((req: Request, res: Response) => {
    const { name, age, cgpa, isPlaced } = req.body ?? {}

    if (!name || !age || !cgpa || isPlaced === undefined) {
        throw new AppError(
            StatusCode.BAD_REQUEST,
            ErrorConstant.INVALID_STUDENT_DATA,
        )
    }

    if (
        students.some(
            (student) =>
                student.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
        )
    ) {
        throw new AppError(
            StatusCode.CONFLICT,
            ErrorConstant.STUDENT_ALREADY_EXISTS,
        )
    }

    const student: Student = {
        age,
        cgpa,
        isPlaced,
        name: name.trim(),
        id: students.length + 1,
    }

    students.push(student)
    res.status(StatusCode.CREATED).json({
        message: "Student added successfully",
        data: student,
    })
})

export const updateStudent = asyncHandler((req: Request, res: Response) => {
    const { id } = req.params ?? {}
    const { name, age, cgpa, isPlaced } = req.body ?? {}

    const student = students.find((student) => student.id === Number(id))

    if (!student) {
        throw new AppError(
            StatusCode.NOT_FOUND,
            ErrorConstant.STUDENT_NOT_FOUND,
        )
    }

    student.age = age ?? student.age
    student.name = name ?? student.name
    student.cgpa = cgpa ?? student.cgpa
    student.isPlaced = isPlaced ?? student.isPlaced

    const index = students.findIndex((s) => s.id === Number(id))
    if (index !== -1) {
        students[index] = student
    }

    res.status(StatusCode.CREATED).json({
        message: "Student updated successfully",
        data: student,
    })
})

export const deleteStudent = asyncHandler((req: Request, res: Response) => {
    const { id } = req.params ?? {}

    if (!id) {
        throw new AppError(
            StatusCode.BAD_REQUEST,
            ErrorConstant.INVALID_STUDENT_DATA,
        )
    }

    const student = students.find((student) => student.id === Number(id))

    if (!student) {
        throw new AppError(
            StatusCode.NOT_FOUND,
            ErrorConstant.STUDENT_NOT_FOUND,
        )
    }

    students.splice(students.indexOf(student), 1)

    res.status(StatusCode.OK).json({
        message: "Student deleted successfully",
        data: student,
    })
})

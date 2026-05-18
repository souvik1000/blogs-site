import { Request, Response } from "express"

import { Student } from "./student.model"

const students: Student[] = []

export const getStudents = (req: Request, res: Response) => {
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

    res.status(200).json({
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
}

export const getStudentById = (req: Request, res: Response) => {
    const { id } = req.params ?? {}

    if (!id) {
        res.status(400).json({ message: "Student id is required" })
        return
    }

    const student = students.find((student) => student.id === Number(id))

    if (!student) {
        res.status(404).json({ message: "Student not found" })
        return
    }

    res.status(200).json({
        message: "Student fetched successfully",
        data: student,
    })
}

export const addStudent = (req: Request, res: Response) => {
    const { name, age, cgpa, isPlaced } = req.body ?? {}

    if (!name || !age || !cgpa || !isPlaced) {
        res.status(400).json({ message: "Invalid student data" })
        return
    }

    if (
        students.some(
            (student) =>
                student.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
        )
    ) {
        res.status(409).json({ message: "Student already exists" })
        return
    }

    const student = {
        age,
        cgpa,
        isPlaced,
        name: name.trim(),
        id: students.length + 1,
    }

    students.push(student)
    res.status(201).json({
        message: "Student added successfully",
        data: student,
    })
}

export const updateStudent = (req: Request, res: Response) => {
    const { id } = req.params ?? {}
    const { name, age, cgpa, isPlaced } = req.body ?? {}

    const student = students.find((student) => student.id === Number(id))

    if (!student) {
        res.status(404).json({ message: "Student not found" })
        return
    }

    student.age = age ?? student.age
    student.name = name ?? student.name
    student.cgpa = cgpa ?? student.cgpa
    student.isPlaced = isPlaced ?? student.isPlaced

    students[Number(id)] = student

    res.status(201).json({
        message: "Student updated successfully",
        data: student,
    })
}

export const deleteStudent = (req: Request, res: Response) => {
    const { id } = req.params ?? {}

    if (!id) {
        res.status(400).json({ message: "Invalid student data" })
        return
    }

    const student = students.find((student) => student.id === Number(id))

    if (!student) {
        res.status(404).json({ message: "Student not found" })
        return
    }

    students.splice(students.indexOf(student), 1)

    res.status(200).json({
        message: "Student deleted successfully",
        data: student,
    })
}

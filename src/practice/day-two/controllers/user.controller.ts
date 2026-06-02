import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import { Users } from "../models/users.model"
import { Orders } from "../models/orders.model"
import { StatusCode } from "../../../enums/statusCode"
import { AppDataSource } from "../../../config/data-source"
import { AppError, asyncHandler } from "../../../utils/error"

const userRepository = AppDataSource.getRepository(Users)

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params ?? {}

    if (!id) {
        throw new AppError(StatusCode.BAD_REQUEST, "User id is required")
    }

    const user = await userRepository
        .createQueryBuilder("users")
        .where("users.id = :id", { id })
        .select([
            "users.id",
            "users.name",
            "users.email",
            "users.bio",
            "users.profilePic",
            "users.isGuest",
            "users.createdAt",
            "users.updatedAt",
        ])
        .getOne()

    console.log("user", user)

    if (!user) {
        throw new AppError(StatusCode.NOT_FOUND, "User not found")
    }

    return res.status(StatusCode.OK).json({
        data: user,
        success: true,
        message: "User fetched successfully",
    })
})

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, bio, password, profilePic, isGuest } = req.body ?? {}

    const user = userRepository.create({
        name,
        email,
        bio,
        password,
        profilePic,
        isGuest,
    })

    await userRepository.createQueryBuilder().insert().values(user).execute()

    return res.status(StatusCode.CREATED).json({
        data: {
            id: user.id,
            name,
            email,
            bio,
            profilePic,
            isGuest,
        },
        success: true,
        message: "User created successfully",
    })
})

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params ?? {}

    if (!id) {
        throw new AppError(StatusCode.BAD_REQUEST, "User id is required")
    }

    const user = await userRepository
        .createQueryBuilder("user")
        .where("user.id = :id", { id })
        .getOne()

    console.log(user)

    if (!user) {
        throw new AppError(StatusCode.NOT_FOUND, "User not found")
    }

    const updatedData = userRepository.merge(user, req.body)
    await userRepository
        .createQueryBuilder()
        .update(Users)
        .set(updatedData)
        .where("id = :id", { id })
        .execute()

    return res.status(StatusCode.OK).json({
        data: updatedData,
        success: true,
        message: "User updated successfully",
    })
})

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params ?? {}

    if (!id) {
        throw new AppError(StatusCode.BAD_REQUEST, "User id is required")
    }
    await AppDataSource.transaction(async (manager: EntityManager) => {
        await manager
            .createQueryBuilder()
            .delete()
            .from(Orders)
            .where("user_id = :id", { id })
            .execute()

        await manager
            .createQueryBuilder()
            .delete()
            .from(Users)
            .where("id = :id", { id })
            .execute()
    })

    return res.status(StatusCode.OK).json({
        success: true,
        message: "User deleted successfully",
    })
})

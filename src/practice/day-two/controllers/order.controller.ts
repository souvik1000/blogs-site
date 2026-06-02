import { Request, Response } from "express"

import { Users } from "../models/users.model"
import { Orders } from "../models/orders.model"
import { StatusCode } from "../../../enums/statusCode"
import { getPagination } from "../../../utils/pagination"
import { AppDataSource } from "../../../config/data-source"
import { AppError, asyncHandler } from "../../../utils/error"
import { generateTemporaryPassword } from "../../../utils/helper"

const userRepository = AppDataSource.getRepository(Users)
const orderRepository = AppDataSource.getRepository(Orders)

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const { limit, page } = req.query ?? {}

    const { skip, take, pageVal, limitVal } = getPagination(
        Number(page),
        Number(limit),
    )

    const [orders, totalOrders] = await orderRepository
        .createQueryBuilder("orders")
        .skip(skip)
        .take(take)
        .getManyAndCount()

    const totalPages = Math.ceil(totalOrders / take)
    const prevPage = pageVal > 1 && pageVal <= totalPages ? pageVal - 1 : null
    const nextPage = pageVal < totalPages ? pageVal + 1 : null

    res.json({
        message: "All orders fetched successfully.",
        data: orders,
        meta: {
            prevPage,
            nextPage,
            totalPages,
            totalOrders,
            page: pageVal,
            limit: limitVal,
        },
    })
})

export const getOrdersByUserId = asyncHandler(
    async (req: Request, res: Response) => {
        const { userId } = req.params ?? {}
        const { limit, page } = req.query ?? {}

        const { skip, take, pageVal, limitVal } = getPagination(
            Number(page),
            Number(limit),
        )

        if (!userId) {
            throw new AppError(StatusCode.BAD_REQUEST, "User id is required")
        }

        const [orders, totalOrders] = await orderRepository
            .createQueryBuilder("order")
            .where("order.userId = :userId", { userId })
            .skip(skip)
            .take(take)
            .getManyAndCount()

        console.log(orders)

        if (!orders) {
            throw new AppError(StatusCode.NOT_FOUND, "Order not found")
        }

        const totalPages = Math.ceil(totalOrders / take)
        const prevPage =
            pageVal > 1 && pageVal <= totalPages ? pageVal - 1 : null
        const nextPage = pageVal < totalPages ? pageVal + 1 : null

        return res.status(StatusCode.OK).json({
            data: orders,
            meta: {
                prevPage,
                nextPage,
                totalPages,
                totalOrders,
                page: pageVal,
                limit: limitVal,
            },
            success: true,
            message: "Order fetched successfully",
        })
    },
)

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params ?? {}
    const { userId } = req.query ?? {}

    if (!id || !userId) {
        throw new AppError(
            StatusCode.BAD_REQUEST,
            "Order id or user id is required",
        )
    }

    const order = await orderRepository
        .createQueryBuilder("orders")
        .where("orders.id = :id", { id })
        .andWhere("orders.userId = :userId", { userId })
        .getOne()

    if (!order) {
        throw new AppError(StatusCode.NOT_FOUND, "Order not found")
    }

    return res.status(StatusCode.OK).json({
        data: order,
        success: true,
        message: "Order fetched successfully",
    })
})

// Todo: Verify products exists in the database
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { userId, productId, status, amount } = req.body ?? {}

    const userExists = await userRepository
        .createQueryBuilder("user")
        .where("user.id = :userId", { userId })
        .getOne()

    if (!userExists) {
        throw new AppError(
            StatusCode.NOT_FOUND,
            `User with ID ${userId} not found`,
        )
    }

    const order = orderRepository.create({ userId, productId, status, amount })
    await orderRepository.createQueryBuilder().insert().values(order).execute()

    return res.status(StatusCode.CREATED).json({
        data: order,
        success: true,
        message: "Order placed successfully",
    })
})

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params ?? {}
    const { userId, status, amount } = req.body ?? {}

    if (!id || !userId) {
        throw new AppError(
            StatusCode.BAD_REQUEST,
            "Order id or user id is required",
        )
    }

    const order = await orderRepository
        .createQueryBuilder("order")
        .where("order.id = :id", { id })
        .andWhere("order.userId = :userId", { userId })
        .getOne()

    if (!order) {
        throw new AppError(StatusCode.NOT_FOUND, "Order not found")
    }

    order.status = status
    order.amount = amount

    const updatedOrder = await orderRepository.save(order)

    return res.status(StatusCode.OK).json({
        data: updatedOrder,
        success: true,
        message: "Order updated successfully",
    })
})

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params ?? {}
    const { userId } = req.query ?? {}

    if (!id || !userId) {
        throw new AppError(
            StatusCode.BAD_REQUEST,
            "Order id or user id is required",
        )
    }

    const order = await orderRepository
        .createQueryBuilder()
        .delete()
        .from(Orders)
        .where("id = :id", { id })
        .andWhere("userId = :userId", { userId })
        .execute()

    return res.status(StatusCode.OK).json({
        data: order,
        success: true,
        message: "Order deleted successfully",
    })
})

export const createOrderByGuestUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { firstName, lastName, email, productId, status, amount } =
            req.body ?? {}

        let savedOrder: Orders

        await AppDataSource.transaction(async (transactionalEntityManager) => {
            let user = await transactionalEntityManager.findOne(Users, {
                where: { email },
            })

            if (!user) {
                const tempPassword = generateTemporaryPassword()

                const newUser = transactionalEntityManager.create(Users, {
                    name: `${firstName} ${lastName}`.trim(),
                    email,
                    password: tempPassword,
                    isGuest: true,
                })
                user = await transactionalEntityManager.save(newUser)
            }

            const order = transactionalEntityManager.create(Orders, {
                userId: user.id,
                productId,
                status,
                amount,
            })
            savedOrder = await transactionalEntityManager.save(order)
        })

        return res.status(StatusCode.CREATED).json({
            data: savedOrder!,
            success: true,
            message: "Order placed successfully",
        })
    },
)

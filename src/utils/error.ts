import { Request, Response, NextFunction, RequestHandler } from "express"

import { StatusCode } from "../enums/statusCode"
import { ErrorConstant } from "../constants/error.constant"

export class AppError extends Error {
    public readonly statusCode: StatusCode
    public readonly isOperational: boolean

    constructor(statusCode: StatusCode, message: string, isOperational = true) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
        this.statusCode = statusCode
        this.isOperational = isOperational
        Error.captureStackTrace(this, this.constructor)
    }
}

// asyncHandler wrapper to automatically catch errors in async express handlers
export const asyncHandler = (fn: Function): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

// Global Centralized Error Handling Middleware
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const statusCode =
        err instanceof AppError
            ? err.statusCode
            : StatusCode.INTERNAL_SERVER_ERROR
    const message = err.message || ErrorConstant.INTERNAL_SERVER_ERROR

    console.error(`[Error] ${statusCode} - ${message}`)
    if (!(err instanceof AppError)) {
        console.error(err.stack)
    }

    res.status(statusCode).json({
        success: false,
        message,
    })
}

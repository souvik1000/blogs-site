import { Schema } from "yup"
import { Request, Response, NextFunction } from "express"

import { AppError } from "../utils/error"
import { StatusCode } from "../enums/statusCode"

export const validate = (schema: Schema) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            req.body = await schema.validate(req.body, {
                abortEarly: true,
                stripUnknown: true,
            })
            next()
        } catch (error: any) {
            next(new AppError(StatusCode.BAD_REQUEST, error.message))
        }
    }
}

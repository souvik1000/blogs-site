import * as yup from "yup"

export const createOrderSchema = yup.object({
    userId: yup
        .number()
        .integer("User ID must be an integer")
        .positive("User ID must be positive")
        .required("User ID is required"),
    productId: yup
        .number()
        .integer("Product ID must be an integer")
        .positive("Product ID must be positive")
        .optional()
        .default(1),
    status: yup
        .string()
        .required("Status is required")
        .max(48, "Status must not exceed 48 characters")
        .trim(),
    amount: yup
        .number()
        .positive("Amount must be a positive number")
        .required("Amount is required"),
})

export const updateOrderSchema = yup.object({
    userId: yup
        .number()
        .integer("User ID must be an integer")
        .positive("User ID must be positive")
        .optional(),
    productId: yup
        .number()
        .integer("Product ID must be an integer")
        .positive("Product ID must be positive")
        .optional(),
    status: yup
        .string()
        .optional()
        .max(48, "Status must not exceed 48 characters")
        .trim(),
    amount: yup
        .number()
        .positive("Amount must be a positive number")
        .optional(),
})

export const createGuestOrderSchema = yup.object({
    firstName: yup
        .string()
        .required("First name is required")
        .max(48, "First name must not exceed 48 characters")
        .trim(),
    lastName: yup
        .string()
        .required("Last name is required")
        .max(48, "Last name must not exceed 48 characters")
        .trim(),
    email: yup
        .string()
        .required("Email is required")
        .email("Invalid email format")
        .max(64, "Email must not exceed 64 characters")
        .trim(),
    productId: yup
        .number()
        .integer("Product ID must be an integer")
        .positive("Product ID must be positive")
        .optional()
        .default(1),
    status: yup
        .string()
        .required("Status is required")
        .max(48, "Status must not exceed 48 characters")
        .trim(),
    amount: yup
        .number()
        .positive("Amount must be a positive number")
        .required("Amount is required"),
})

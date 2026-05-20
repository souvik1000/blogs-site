import * as yup from "yup"

export const createUserSchema = yup.object({
    name: yup
        .string()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(48, "Name must not exceed 48 characters")
        .trim(),
    email: yup
        .string()
        .required("Email is required")
        .email("Invalid email format")
        .max(64, "Email must not exceed 64 characters")
        .trim(),
    bio: yup
        .string()
        .max(255, "Bio must not exceed 255 characters")
        .nullable()
        .optional(),
    password: yup
        .string()
        .required("Password is required")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        )
        .max(32, "Password must not exceed 32 characters"),
    profilePic: yup
        .string()
        .max(64, "Profile picture path must not exceed 64 characters")
        .nullable()
        .optional(),
    isGuest: yup.boolean().optional().default(false),
})

export const updateUserSchema = yup.object({
    name: yup
        .string()
        .optional()
        .min(3, "Name must be at least 3 characters")
        .max(48, "Name must not exceed 48 characters")
        .trim(),
    email: yup
        .string()
        .optional()
        .email("Invalid email format")
        .max(64, "Email must not exceed 64 characters")
        .trim(),
    bio: yup
        .string()
        .max(255, "Bio must not exceed 255 characters")
        .nullable()
        .optional(),
    password: yup
        .string()
        .optional()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        )
        .max(32, "Password must not exceed 32 characters"),
    profilePic: yup
        .string()
        .max(64, "Profile picture path must not exceed 64 characters")
        .nullable()
        .optional(),
    isGuest: yup.boolean().optional(),
})

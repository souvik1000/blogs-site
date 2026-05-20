/**
 * Generates a temporary password compliant with the system validation requirements:
 * - At least 8 characters (max 32)
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 */
export const generateTemporaryPassword = (): string => {
    return `Guest@${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}${Math.floor(100 + Math.random() * 900)}`
}

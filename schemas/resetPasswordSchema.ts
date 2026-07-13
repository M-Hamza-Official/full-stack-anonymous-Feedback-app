import z from "zod";

export const resetPasswordSchema = z
    .object({
        email: z
            .string()
            .email({ message: "Please enter a valid email address" }),
        code: z
            .string()
            .length(6, { message: "Code must be 6 digits" }),
        newPassword: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" }),
        confirmPassword: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
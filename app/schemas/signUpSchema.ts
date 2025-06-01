import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(
    /^[a-zA-Z!@#$%^&*]+$/,
    "Username can only contain letters and special characters"
  )
  .refine((val) => /[a-zA-Z]/.test(val), {
    message: "Username must contain at least one letter",
  
  })

export const signUpSchema = z.object({
  username: usernameValidation,

  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

import { z } from "zod";

const passwordRules = z.string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Must include uppercase")
  .regex(/[0-9]/, "Must include a number");

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: passwordRules,
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(2, "At least 2 characters"),
  lastName: z.string().min(2, "At least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Too short"),
  password: passwordRules,
  confirmPassword: z.string().min(8),
  role: z.enum(["EMPLOYEE", "COMPANY"]),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match", path: ["confirmPassword"],
});
export type RegisterFormData = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z.object({
  password: passwordRules,
  confirmPassword: z.string().min(8),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match", path: ["confirmPassword"],
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email"),
});
export type ResetPasswordRequestFormData = z.infer<typeof resetPasswordRequestSchema>;

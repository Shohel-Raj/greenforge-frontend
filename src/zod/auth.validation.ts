import { z } from "zod";
const passwordValidation = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[@$!%*?&]/,
    "Password must contain at least one special character (@, $, !, %, *, ?, &)",
  );

export const loginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: passwordValidation,
});
export const RegisterZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: passwordValidation,
});

export const verifyEmailZodSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().min(1, "OTP is required"),
});
export const changePasswordZodSchema = z.object({
  currentPassword: passwordValidation,

  newPassword: passwordValidation,
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IRegisterPayload = z.infer<typeof RegisterZodSchema>;
export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;
export type IChangePasswordPayload = z.infer<typeof changePasswordZodSchema>;

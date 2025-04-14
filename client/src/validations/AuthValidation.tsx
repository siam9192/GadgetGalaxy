import { z } from "zod";

const LoginValidationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password cannot be empty" }),
});

const SignupValidation = z
  .object({
    fullName: z.string({ required_error: "Full name is required" }).min(3).max(30),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, { message: "Password cannot be empty" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const ChangePasswordValidation = z
  .object({
    oldPassword: z.string().min(1, { message: "Old password is required" }),

    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(32, { message: "Password must be no more than 32 characters long" }),

    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const ResetPasswordValidation = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(32, { message: "Password must be no more than 32 characters long" }),

    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const AuthValidations = {
  LoginValidationSchema,
  ChangePasswordValidation,
  ResetPasswordValidation,
  SignupValidation,
};

export default AuthValidations;

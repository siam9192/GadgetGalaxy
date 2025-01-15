import { z } from "zod";

const SignUpValidationSchema = z.object({
  fullName: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(32),
});

const VerifyAccountOtpValidationSchema = z.object({
  otp: z.string(),
  token: z.string(),
});

const ResendOtpValidationSchema = z.object({
  token: z.string(),
});

const LoginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const ChangePasswordValidationSchema = z.object({
  newPassword: z.string(),
  oldPassword: z.string(),
});

const AuthValidations = {
  SignUpValidationSchema,
  VerifyAccountOtpValidationSchema,
  ResendOtpValidationSchema,
  LoginValidationSchema,
  ChangePasswordValidationSchema,
};

export default AuthValidations;

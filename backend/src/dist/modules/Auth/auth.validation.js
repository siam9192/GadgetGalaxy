"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const SignUpValidationSchema = zod_1.z.object({
  fullName: zod_1.z.string().min(3).max(30),
  email: zod_1.z.string().email(),
  password: zod_1.z.string().min(6).max(32),
});
const VerifyAccountOtpValidationSchema = zod_1.z.object({
  otp: zod_1.z.string(),
  token: zod_1.z.string(),
});
const ResendOtpValidationSchema = zod_1.z.object({
  token: zod_1.z.string(),
});
const LoginValidationSchema = zod_1.z.object({
  email: zod_1.z.string().email(),
  password: zod_1.z.string(),
});
const ChangePasswordValidationSchema = zod_1.z.object({
  newPassword: zod_1.z.string(),
  oldPassword: zod_1.z.string(),
});
const ResetPasswordValidation = zod_1.z.object({
  token: zod_1.z.string().nonempty(),
  newPassword: zod_1.z.string().nonempty().min(6),
});
const AuthValidations = {
  SignUpValidationSchema,
  VerifyAccountOtpValidationSchema,
  ResendOtpValidationSchema,
  LoginValidationSchema,
  ChangePasswordValidationSchema,
  ResetPasswordValidation,
};
exports.default = AuthValidations;

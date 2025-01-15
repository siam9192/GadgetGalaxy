import { z } from "zod";

export const NameValidationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const PasswordValidation = z.string().min(6).max(32);

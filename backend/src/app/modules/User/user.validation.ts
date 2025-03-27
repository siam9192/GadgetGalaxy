import { UserGender, UserRole } from "@prisma/client";
import { z } from "zod";

const ChangeUserStatusValidation = z.object({
  user_id: z.number(),
  status: z.enum(["Active", "Blocked"]),
});

const CreateAdministratorValidation = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6).max(32),
  profilePhoto: z.string(),
  gender: z.enum(Object.values(UserGender) as any),
  role: z.enum([UserRole.ADMIN, UserRole.MODERATOR]),
  phoneNumber: z.string().optional(),
});

const UserValidations = {
  ChangeUserStatusValidation,
  CreateAdministratorValidation,
};

export default UserValidations;

import { z } from "zod";
import { UserGender } from "@prisma/client";

// Zod schema for validating updated addresses
const UpdatedAddressSchema = z.object({
  id: z.string().optional(),
  district: z.string(),
  zone: z.string(),
  line: z.string(),
  isDefault: z.boolean(),
  isDeleted: z.boolean().optional(),
});

// Zod schema for IUpdateCustomerProfilePayload
export const UpdateCustomerProfileValidation = z.object({
  id: z.string().optional(),
  fullName: z.string().optional(),
  profilePhoto: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.nativeEnum(UserGender).optional(),
  dateOfBirth: z.string().optional(),
  addresses: z.array(UpdatedAddressSchema).optional(),
});

// Zod schema for IUpdateStaffProfilePayload
export const UpdateAdministratorProfileValidation = z.object({
  fullName: z.string().optional(),
  profilePhoto: z.string().optional(),
  gender: z.nativeEnum(UserGender).optional(),
  phoneNumber: z.string().optional(),
});

const ProfileValidations = {
  UpdateCustomerProfileValidation,
  UpdateAdministratorProfileValidation,
};

export default ProfileValidations;

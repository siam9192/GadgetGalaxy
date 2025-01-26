import { z } from "zod";
import { UserGender } from "@prisma/client";

// Zod schema for validating updated addresses
const UpdatedAddressSchema = z.object({
  id: z.string(),
  district: z.string().optional(),
  zone: z.string().optional(),
  line: z.string().optional(),
  isDefault: z.boolean().optional(),
});

// Zod schema for validating newly added addresses
const NewAddedAddressSchema = z.object({
  district: z.string(),
  zone: z.string(),
  line: z.string(),
  isDefault: z.boolean(),
});

// Zod schema for IUpdateCustomerProfilePayload
export const UpdateCustomerProfileValidation = z.object({
  fullName: z.string().optional(),
  profilePhoto: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.nativeEnum(UserGender).optional(),
  dateOfBirth: z.string().optional(),
  updatedAddresses: z.array(UpdatedAddressSchema).optional(),
  newAddedAddresses: z.array(NewAddedAddressSchema).optional(),
  deletedAddressesIds: z.array(z.string()).optional(),
});

// Zod schema for IUpdateStaffProfilePayload
export const UpdateStaffProfileValidation = z.object({
  fullName: z.string().optional(),
  profilePhoto: z.string().optional(),
  gender: z.nativeEnum(UserGender).optional(),
});

const ProfileValidations = {
  UpdateStaffProfileValidation,
  UpdateCustomerProfileValidation,
};

export default ProfileValidations;

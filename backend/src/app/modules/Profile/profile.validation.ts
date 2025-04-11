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
  fullName: z
  .string()
  .min(1, { message: "Full name is required" })
  .max(100, { message: "Full name must be less than 100 characters" }).optional(),

profilePhoto: z
  .string()
  .url({ message: "Profile photo must be a valid URL" }).optional(),

phoneNumber: z
  .string()
  .min(10, { message: "Phone number must be at least 10 digits" })
  .max(15, { message: "Phone number must not exceed 15 digits" }).optional(),

gender: z.nativeEnum(UserGender, {
  required_error: "Gender is required",
  invalid_type_error: "Invalid gender selected",
}).optional(),

dateOfBirth: z
  .string()
  .refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Date of birth must be a valid date" }
  )
  .refine((val) => {
    const dob = new Date(val);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 7, today.getMonth(), today.getDate());
    return dob <= minDate;
  }, {
    message: "You must be at least 7 years old",
  }).optional()
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

import { EGender } from "@/types/user.type";
import { z } from "zod";

const UpdateProfileValidation = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name is required min 3 characters" })
    .max(100, { message: "Full name must be less than 100 characters" }),

  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must not exceed 15 digits" })
    .optional(),

  gender: z
    .nativeEnum(EGender, {
      required_error: "Gender is required",
      invalid_type_error: "Invalid gender selected",
    })
    .optional(),

  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Date of birth must be a valid date" })
    .refine(
      (val) => {
        const dob = new Date(val);
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 7, today.getMonth(), today.getDate());
        return dob <= minDate;
      },
      {
        message: "You must be at least 7 years old",
      },
    )
    .optional(),
});

const ProfileValidations = {
  UpdateProfileValidation,
};

export default ProfileValidations;

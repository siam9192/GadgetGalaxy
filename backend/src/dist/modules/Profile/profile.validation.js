"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdministratorProfileValidation = exports.UpdateCustomerProfileValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Zod schema for validating updated addresses
const UpdatedAddressSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    district: zod_1.z.string(),
    zone: zod_1.z.string(),
    line: zod_1.z.string(),
    isDefault: zod_1.z.boolean(),
    isDeleted: zod_1.z.boolean().optional(),
});
// Zod schema for IUpdateCustomerProfilePayload
exports.UpdateCustomerProfileValidation = zod_1.z.object({
    id: zod_1.z.string().optional(),
    fullName: zod_1.z
        .string()
        .min(1, { message: "Full name is required" })
        .max(100, { message: "Full name must be less than 100 characters" })
        .optional(),
    profilePhoto: zod_1.z
        .string()
        .url({ message: "Profile photo must be a valid URL" })
        .optional(),
    phoneNumber: zod_1.z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(15, { message: "Phone number must not exceed 15 digits" })
        .optional(),
    gender: zod_1.z
        .nativeEnum(client_1.UserGender, {
        required_error: "Gender is required",
        invalid_type_error: "Invalid gender selected",
    })
        .optional(),
    dateOfBirth: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Date of birth must be a valid date",
    })
        .refine((val) => {
        const dob = new Date(val);
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 7, today.getMonth(), today.getDate());
        return dob <= minDate;
    }, {
        message: "You must be at least 7 years old",
    })
        .optional(),
    addresses: zod_1.z.array(UpdatedAddressSchema).optional(),
});
// Zod schema for IUpdateStaffProfilePayload
exports.UpdateAdministratorProfileValidation = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    profilePhoto: zod_1.z.string().optional(),
    gender: zod_1.z.nativeEnum(client_1.UserGender).optional(),
    phoneNumber: zod_1.z.string().optional(),
});
const ProfileValidations = {
    UpdateCustomerProfileValidation: exports.UpdateCustomerProfileValidation,
    UpdateAdministratorProfileValidation: exports.UpdateAdministratorProfileValidation,
};
exports.default = ProfileValidations;

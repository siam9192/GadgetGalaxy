"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdministratorProfileValidation =
  exports.UpdateCustomerProfileValidation = void 0;
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
  fullName: zod_1.z.string().optional(),
  profilePhoto: zod_1.z.string().optional(),
  phoneNumber: zod_1.z.string().optional(),
  gender: zod_1.z.nativeEnum(client_1.UserGender).optional(),
  dateOfBirth: zod_1.z.string().optional(),
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
  UpdateAdministratorProfileValidation:
    exports.UpdateAdministratorProfileValidation,
};
exports.default = ProfileValidations;

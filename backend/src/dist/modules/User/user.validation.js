"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const ChangeUserStatusValidation = zod_1.z.object({
    user_id: zod_1.z.number(),
    status: zod_1.z.enum(["Active", "Blocked"]),
});
const CreateAdministratorValidation = zod_1.z.object({
    fullName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(32),
    profilePhoto: zod_1.z.string(),
    gender: zod_1.z.enum(Object.values(client_1.UserGender)),
    role: zod_1.z.enum([client_1.UserRole.ADMIN, client_1.UserRole.MODERATOR]),
    phoneNumber: zod_1.z.string().optional(),
});
const UserValidations = {
    ChangeUserStatusValidation,
    CreateAdministratorValidation,
};
exports.default = UserValidations;

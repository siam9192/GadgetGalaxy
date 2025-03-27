"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordValidation = exports.NameValidationSchema = void 0;
const zod_1 = require("zod");
exports.NameValidationSchema = zod_1.z.object({
  firstName: zod_1.z.string(),
  lastName: zod_1.z.string(),
});
exports.PasswordValidation = zod_1.z.string().min(6).max(32);

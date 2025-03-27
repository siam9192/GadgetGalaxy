"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const CreateBrandValidation = zod_1.z.object({
  name: zod_1.z.string().min(1).nonempty().max(50),
  description: zod_1.z.string().min(20).max(2000),
  logoUrl: zod_1.z.string(),
  origin: zod_1.z.string().optional(),
  isPopular: zod_1.z.boolean().optional(),
  isFeatured: zod_1.z.boolean().optional(),
});
const UpdateBrandValidation = CreateBrandValidation.partial();
const BrandValidations = {
  CreateBrandValidation,
  UpdateBrandValidation,
};
exports.default = BrandValidations;

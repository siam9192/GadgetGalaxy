"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const CreateCategoryValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(50),
    imageUrl: zod_1.z.string().url().optional(),
    parentId: zod_1.z.number().optional(),
    isFeatured: zod_1.z.boolean().default(false),
    isVisible: zod_1.z.boolean().optional(),
    children: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string(),
        isFeatured: zod_1.z.boolean(),
        imageUrl: zod_1.z.string().optional()
    }))
        .optional(),
});
const UpdateCategoryValidationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().optional(),
    isFeatured: zod_1.z.boolean().optional(),
});
const CategoryValidations = {
    CreateCategoryValidationSchema,
    UpdateCategoryValidationSchema,
};
exports.default = CategoryValidations;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeDiscountStatusValidation = exports.ApplyDiscountValidation = exports.UpdateDiscountValidation = exports.CreateDiscountValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.CreateDiscountValidation = zod_1.z.object({
    code: zod_1.z.string().nonempty("Discount code is required."),
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().nonempty("Description is required."),
    discountType: zod_1.z.enum(Object.values(client_1.DiscountType)),
    discountValue: zod_1.z.number().positive("Discount value must be positive."),
    minOrderValue: zod_1.z.number().positive().optional(),
    maxDiscount: zod_1.z.number().positive().optional(),
    usageLimit: zod_1.z.number().positive().min(1).optional(),
    usageCount: zod_1.z.number().nonnegative().optional(),
    validFrom: zod_1.z.string().date(),
    validUntil: zod_1.z.string().date(),
    customersId: zod_1.z
        .array(zod_1.z.string())
        .nonempty("Customers ID array cannot be empty.")
        .optional(),
    categoriesId: zod_1.z
        .array(zod_1.z.string())
        .nonempty("Categories ID array cannot be empty.")
        .optional(),
    status: zod_1.z.enum(Object.values(client_1.DiscountStatus)).optional(),
});
exports.UpdateDiscountValidation = zod_1.z.object({
    code: zod_1.z.string().optional(),
    title: zod_1.z.string().min(3).max(200).optional(),
    description: zod_1.z.string().max(2000).optional(),
    discountType: zod_1.z.enum(Object.values(client_1.DiscountType)).optional(),
    discountValue: zod_1.z.number().positive().optional(),
    minOrderValue: zod_1.z.number().positive().optional(),
    maxDiscount: zod_1.z.number().positive().optional(),
    usageLimit: zod_1.z.number().positive().optional(),
    usageCount: zod_1.z.number().nonnegative().optional(),
    validFrom: zod_1.z.string().datetime().optional(),
    validUntil: zod_1.z.string().datetime().optional(),
    new: zod_1.z
        .object({
        customersId: zod_1.z.array(zod_1.z.number()).optional(),
        categoriesId: zod_1.z.array(zod_1.z.number()).optional(),
    })
        .optional(),
    removed: zod_1.z
        .object({
        customersId: zod_1.z.array(zod_1.z.number()).optional(),
        categoriesId: zod_1.z.array(zod_1.z.number()).optional(),
    })
        .optional(),
    status: zod_1.z.enum(Object.values(client_1.DiscountStatus)).optional(),
});
exports.ApplyDiscountValidation = zod_1.z.object({
    code: zod_1.z.string(),
    cartItemsId: zod_1.z.array(zod_1.z.string()),
});
exports.ChangeDiscountStatusValidation = zod_1.z.object({
    id: zod_1.z.number().positive(),
    status: zod_1.z.nativeEnum(client_1.DiscountStatus),
});
const DiscountValidations = {
    CreateDiscountValidation: exports.CreateDiscountValidation,
    UpdateDiscountValidation: exports.UpdateDiscountValidation,
    ChangeDiscountStatusValidation: exports.ChangeDiscountStatusValidation,
    ApplyDiscountValidation: exports.ApplyDiscountValidation,
};
exports.default = DiscountValidations;

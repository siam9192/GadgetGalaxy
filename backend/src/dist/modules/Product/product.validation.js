"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const VariantAttributeValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    value: zod_1.z.string().min(1),
});
const CreateVariantValidationSchema = zod_1.z.object({
    sku: zod_1.z.string(),
    colorName: zod_1.z.string(),
    colorCode: zod_1.z.string(),
    attributes: zod_1.z.array(VariantAttributeValidationSchema),
    price: zod_1.z.number(),
    offerPrice: zod_1.z.number().optional(),
    availableQuantity: zod_1.z
        .number()
        .int("Available quantity must be an integer")
        .nonnegative("Available quantity must be zero or a positive number"),
    isHighlighted: zod_1.z.boolean(),
});
const CreateSpecificationValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    value: zod_1.z.string(),
});
const UpdateVariantValidationSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    sku: zod_1.z.string(),
    colorName: zod_1.z.string(),
    colorCode: zod_1.z.string(),
    attributes: zod_1.z.array(VariantAttributeValidationSchema),
    price: zod_1.z.number().positive("Regular price must be a positive number"), // Must be positive
    offerPrice: zod_1.z
        .number()
        .nonnegative("Sale price must be zero or a positive number")
        .optional(), // Must not exceed regular price
    availableQuantity: zod_1.z
        .number()
        .int("Available quantity must be an integer")
        .nonnegative("Available quantity must be zero or a positive number"),
    isHighlighted: zod_1.z.boolean(),
    isDeleted: zod_1.z.boolean().optional(),
});
const CreateProductValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"), // Name must be a non-empty string
    brandId: zod_1.z.number().optional(),
    description: zod_1.z.string().min(50).max(10000), // Description is optional
    warrantyInfo: zod_1.z.string().min(10).max(1000),
    price: zod_1.z.number().positive("Regular price must be a positive number"), // Must be positive
    offerPrice: zod_1.z
        .number()
        .nonnegative("Sale price must be zero or a positive number")
        .optional(), // Must not exceed regular price
    sku: zod_1.z.string({ required_error: "SKU is required" }),
    variants: zod_1.z.array(CreateVariantValidationSchema).optional(),
    specifications: zod_1.z.array(CreateSpecificationValidationSchema),
    availableQuantity: zod_1.z
        .number()
        .int("Available quantity must be an integer")
        .nonnegative("Available quantity must be zero or a positive number"),
    imagesUrl: zod_1.z
        .array(zod_1.z.string().url("Each image must be a valid URL"))
        .nonempty("At least one image is required"), // At least one valid URL
    categoriesId: zod_1.z.array(zod_1.z.number()).min(1, "Category  is required"), // Non-empty string
});
// .refine((data)=>{
//   return data.offerPrice && data.offerPrice >= data.price
// },{
//   path:['offerPrice'],
//   message:"Offer price can not be getter than or equal main price"
// })
const UpdateProductValidation = zod_1.z
    .object({
    name: zod_1.z.string().min(1, "Name is required"), // Name must be a non-empty string
    brandId: zod_1.z.number().optional(),
    description: zod_1.z.string().min(50).max(10000), // Description is optional
    warrantyInfo: zod_1.z.string().min(10).max(1000),
    price: zod_1.z.number().positive("Regular price must be a positive number"), // Must be positive
    offerPrice: zod_1.z
        .number()
        .nonnegative("Sale price must be zero or a positive number")
        .optional(), // Must not exceed regular price
    sku: zod_1.z.string({ required_error: "SKU is required" }),
    variants: zod_1.z.array(UpdateVariantValidationSchema).optional(),
    specifications: zod_1.z.array(CreateSpecificationValidationSchema),
    availableQuantity: zod_1.z
        .number()
        .int("Available quantity must be an integer")
        .nonnegative("Available quantity must be zero or a positive number"),
    imagesUrl: zod_1.z
        .array(zod_1.z.string().url("Each image must be a valid URL"))
        .nonempty("At least one image is required"), // At least one valid URL
    categoriesId: zod_1.z.array(zod_1.z.number()).min(1, "Category  is required"), // Non-empty string
})
    .partial();
// .refine((data)=>{
//   return data.price && data.offerPrice && data.offerPrice >= data.price
// },{
//   path:['offerPrice'],
//   message:"Offer price can not be getter than or equal main price"
// });
const UpdateProductStockValidation = zod_1.z.object({
    productId: zod_1.z.number(),
    variantId: zod_1.z.number().optional(),
    availableQuantity: zod_1.z.number(),
});
const ProductValidations = {
    CreateProductValidation,
    UpdateProductValidation,
    UpdateProductStockValidation,
};
exports.default = ProductValidations;

import { z } from "zod";

const VariantAttributeValidationSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

const CreateVariantValidationSchema = z.object({
  sku: z.string(),
  colorName: z.string(),
  colorCode: z.string(),
  attributes: z.array(VariantAttributeValidationSchema),
  price: z.number(),
  offerPrice: z.number().optional(),
  availableQuantity: z
    .number()
    .int("Available quantity must be an integer")
    .nonnegative("Available quantity must be zero or a positive number"),
  isHighlighted: z.boolean(),
});

const CreateSpecificationValidationSchema = z.object({
  name: z.string(),
  value: z.string(),
});

const UpdateVariantValidationSchema = z.object({
  id: z.number().optional(),
  sku: z.string(),
  colorName: z.string(),
  colorCode: z.string(),
  attributes: z.array(VariantAttributeValidationSchema),
  price: z.number().positive("Regular price must be a positive number"), // Must be positive
  offerPrice: z
    .number()
    .nonnegative("Sale price must be zero or a positive number")
    .optional(), // Must not exceed regular price
  availableQuantity: z
    .number()
    .int("Available quantity must be an integer")
    .nonnegative("Available quantity must be zero or a positive number"),
  isHighlighted: z.boolean(),
  isDeleted: z.boolean().optional(),
});

const CreateProductValidation = z.object({
  name: z.string().min(1, "Name is required"), // Name must be a non-empty string
  brandId: z.number().optional(),
  description: z.string().min(50).max(10000), // Description is optional
  warrantyInfo: z.string().min(10).max(1000),
  price: z.number().positive("Regular price must be a positive number"), // Must be positive
  offerPrice: z
    .number()
    .nonnegative("Sale price must be zero or a positive number")
    .optional(), // Must not exceed regular price
  sku: z.string({ required_error: "SKU is required" }),
  variants: z.array(CreateVariantValidationSchema).optional(),
  specifications: z.array(CreateSpecificationValidationSchema),
  availableQuantity: z
    .number()
    .int("Available quantity must be an integer")
    .nonnegative("Available quantity must be zero or a positive number"),
  imagesUrl: z
    .array(z.string().url("Each image must be a valid URL"))
    .nonempty("At least one image is required"), // At least one valid URL
  categoriesId: z.array(z.number()).min(1, "Category  is required"), // Non-empty string
});

// .refine((data)=>{
//   return data.offerPrice && data.offerPrice >= data.price
// },{
//   path:['offerPrice'],
//   message:"Offer price can not be getter than or equal main price"
// })

const UpdateProductValidation = z
  .object({
    name: z.string().min(1, "Name is required"), // Name must be a non-empty string
    brandId: z.number().optional(),
    description: z.string().min(50).max(10000), // Description is optional
    warrantyInfo: z.string().min(10).max(1000),
    price: z.number().positive("Regular price must be a positive number"), // Must be positive
    offerPrice: z
      .number()
      .nonnegative("Sale price must be zero or a positive number")
      .optional(), // Must not exceed regular price
    sku: z.string({ required_error: "SKU is required" }),
    variants: z.array(UpdateVariantValidationSchema).optional(),
    specifications: z.array(CreateSpecificationValidationSchema),
    availableQuantity: z
      .number()
      .int("Available quantity must be an integer")
      .nonnegative("Available quantity must be zero or a positive number"),
    imagesUrl: z
      .array(z.string().url("Each image must be a valid URL"))
      .nonempty("At least one image is required"), // At least one valid URL
    categoriesId: z.array(z.number()).min(1, "Category  is required"), // Non-empty string
  })
  .partial();
// .refine((data)=>{
//   return data.price && data.offerPrice && data.offerPrice >= data.price
// },{
//   path:['offerPrice'],
//   message:"Offer price can not be getter than or equal main price"
// });

const UpdateProductStockValidation = z.object({
  productId: z.number(),
  variantId: z.number().optional(),
  availableQuantity: z.number(),
});

const ProductValidations = {
  CreateProductValidation,
  UpdateProductValidation,
  UpdateProductStockValidation,
};

export default ProductValidations;

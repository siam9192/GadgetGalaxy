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

const UpdateVariantAttributeValidationSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  value: z.string(),
});

const UpdateTagValidationSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  isDeleted: z.boolean().optional(),
  isNewAdded: z.boolean().optional(),
});

const UpdateImageValidationSchema = z.object({
  id: z.string().optional(),
  url: z.string().optional(),
  isDeleted: z.boolean().optional(),
  isNewAdded: z.boolean().optional(),
});

const UpdateVariantValidationSchema = z.object({
  id: z.string().optional(),
  sku: z.string(),
  colorName: z.string(),
  colorCode: z.string(),
  attributes: z.array(VariantAttributeValidationSchema),
  regularPrice: z.number(),
  salePrice: z.number(),
  stock: z.number(),
  isHighlighted: z.boolean(),
  isDeleted: z.boolean().optional(),
  isNewAdded: z.boolean().optional(),
});

const CreateProductValidation = z.object({
  name: z.string().min(1, "Name is required"), // Name must be a non-empty string
  brandId: z.string().optional(),
  description: z.string().min(100).max(10000), // Description is optional
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
  imageUrls: z
    .array(z.string().url("Each image must be a valid URL"))
    .nonempty("At least one image is required"), // At least one valid URL
  categoryIds: z.array(z.number()).min(1, "Category  is required"), // Non-empty string
});

const UpdateProductValidation = z
  .object({
    id: z.string(),
    name: z.string().min(1, "Name is required"), // Name must be a non-empty string
    brandId: z.string().optional(),
    description: z.string().optional(), // Description is optional
    regularPrice: z
      .number()
      .positive("Regular price must be a positive number"), // Must be positive
    salePrice: z
      .number()
      .nonnegative("Sale price must be zero or a positive number"), // Must not exceed regular price
    stock: z
      .number()
      .int("Stock must be an integer")
      .nonnegative("Stock must be zero or a positive number"), // Integer and >= 0
    variants: z.array(UpdateVariantValidationSchema),
    deletedVariantsId: z.string().optional(),
    deletedVariantsAttributesId: z.string().optional(),
    specification: z.array(CreateSpecificationValidationSchema),
    newSpecification: z.array(CreateVariantValidationSchema).optional(),
    deletedSpecificationIds: z.array(z.string()).optional(),
    newImages: z
      .array(z.string().url("Each image must be a valid URL"))
      .nonempty("At least one image is required"), // At least one valid URL
    deletedImagesId: z.array(z.string()),
    newTags: z.array(z.string()).optional(), // Optional array of strings
    deletedTagsId: z.array(z.string()).optional(),
    categoryId: z.string().min(1, "Category ID is required"), // Non-empty string
  })
  .partial();

const ProductValidations = {
  CreateProductValidation,
  UpdateProductValidation,
};

export default ProductValidations;

import { z } from "zod";

const CreateCategoryValidationSchema = z.object({
  name: z.string().min(1).max(50),
  imageUrl: z.string().url().optional(),
  parentId: z.number().optional(),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().optional(),
  children: z
    .array(
      z.object({
        name: z.string(),
        isFeatured: z.boolean(),
        imageUrl:z.string().optional()
      }),
    )
    .optional(),
});

const UpdateCategoryValidationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

const CategoryValidations = {
  CreateCategoryValidationSchema,
  UpdateCategoryValidationSchema,
};

export default CategoryValidations;

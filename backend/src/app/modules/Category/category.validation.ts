import { z } from "zod";

const CreateCategoryValidationSchema = z.object({
  name: z.string().min(1).max(50),
  parentId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  children: z.array(
    z.object({
      name: z.string(),
      isFeatured: z.boolean(),
    }),
  ),
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

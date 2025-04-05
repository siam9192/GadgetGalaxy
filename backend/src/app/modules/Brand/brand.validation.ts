import { z } from "zod";

const CreateBrandValidation = z.object({
  name: z.string().min(1).nonempty().max(50),
  description: z.string().min(20).max(2000),
  logoUrl: z.string(),
  origin: z.string().optional(),
  isPopular: z.boolean().optional(),
  isTop: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

const UpdateBrandValidation = CreateBrandValidation.partial();

const BrandValidations = {
  CreateBrandValidation,
  UpdateBrandValidation,
};

export default BrandValidations;

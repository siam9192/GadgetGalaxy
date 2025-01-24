import { z } from "zod";

const CreateBrandValidation = z.object({
  name: z.string(),
  description: z.string(),
  logoUrl: z.string(),
  origin: z.string().optional(),
  isPopular: z.boolean().optional(),
});

const UpdateBrandValidation = CreateBrandValidation.partial();

const BrandValidations = {
  CreateBrandValidation,
  UpdateBrandValidation,
};

export default BrandValidations;

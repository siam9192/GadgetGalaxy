import { z } from "zod";

const CreateShopValidation = z.object({
  name: z.string().max(20),
  logo: z.string().url(),
  description: z.string().max(5000).min(20),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().max(40),
});

const UpdateShopValidation = CreateShopValidation.partial();

const ChangeShopBlacklistStatus = z.object({
  status: z.boolean(),
});

const ShopValidations = {
  CreateShopValidation,
  UpdateShopValidation,
  ChangeShopBlacklistStatus,
};

export default ShopValidations;

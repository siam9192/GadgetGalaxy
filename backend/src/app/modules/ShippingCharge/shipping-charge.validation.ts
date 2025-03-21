import { z } from "zod";

const CreateShippingChargeValidation = z.object({
  title: z.string(),
  description: z.string().optional(),
  cost: z.number().min(1),
});

const UpdateShippingChargeValidation = CreateShippingChargeValidation.partial();

const ShippingChargeValidations = {
  CreateShippingChargeValidation,
  UpdateShippingChargeValidation,
};

export default ShippingChargeValidations;

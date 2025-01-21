import { z } from "zod";

const CreateCartItemValidation = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().min(1),
});

const CartItemValidations = {
  CreateCartItemValidation,
};

export default CartItemValidations;

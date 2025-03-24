import { z } from "zod";

const CreateCartItemValidation = z.object({
  productId: z.number(),
  variantId: z.number().optional(),
  quantity: z.number().min(1),
});

const ChangeItemQuantity = z.object({
  id: z.string(),
  quantity: z.number().min(1),
});
const CartItemValidations = {
  CreateCartItemValidation,
  ChangeItemQuantity,
};

export default CartItemValidations;

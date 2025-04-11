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

const changeItemVariantValidation = z.object({
  id: z.string(),
 variantId:z.number(),
});
const CartItemValidations = {
  CreateCartItemValidation,
  ChangeItemQuantity,
  changeItemVariantValidation
};

export default CartItemValidations;

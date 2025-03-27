import { z } from "zod";

const CreateWishListItemValidation = z.object({
  productId: z.number(),
});

const WishListItemValidations = {
  CreateWishListItemValidation,
};

export default WishListItemValidations;

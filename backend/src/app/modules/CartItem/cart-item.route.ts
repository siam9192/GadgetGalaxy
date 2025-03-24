import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import CartItemValidations from "./cart-item.validation";
import CartItemControllers from "./cart-item.controller";

const router = Router();

router.post(
  "/",
  auth([UserRole.CUSTOMER]),
  validateRequest(CartItemValidations.CreateCartItemValidation),
  CartItemControllers.createCartItem,
);

router.patch(
  "/change-quantity",
  auth([UserRole.CUSTOMER]),
  validateRequest(CartItemValidations.ChangeItemQuantity),
  CartItemControllers.changeItemQuantity,
);

router.get("/", auth([UserRole.CUSTOMER]), CartItemControllers.getMyCartItems);

router.delete(
  "/:id",
  auth([UserRole.CUSTOMER]),
  CartItemControllers.deleteCartItemFromDB,
);

const CartItemRouter = router;

export default CartItemRouter;

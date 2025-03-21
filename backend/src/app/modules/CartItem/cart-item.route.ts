import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import CartItemValidations from "./cart-item.validation";
import CartItemControllers from "./cart-item.controller";

const router = Router();

router.post(
  "/",
  auth([UserRole.Customer]),
  validateRequest(CartItemValidations.CreateCartItemValidation),
  CartItemControllers.createCartItem,
);

router.get("/", auth([UserRole.Customer]), CartItemControllers.getMyCartItems);

router.delete(
  "/:id",
  auth([UserRole.Customer]),
  CartItemControllers.deleteCartItemFromDB,
);

const CartItemRouter = router;

export default CartItemRouter;

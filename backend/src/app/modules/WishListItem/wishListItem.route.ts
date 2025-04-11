import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import WishListItemControllers from "./wishListItem.controller";
import validateRequest from "../../middlewares/validateRequest";
import WishListItemValidations from "./wishListItem.validation";

const router = Router();

router.post(
  "/",
  auth([UserRole.CUSTOMER]),
  validateRequest(WishListItemValidations.CreateWishListItemValidation),
  WishListItemControllers.createWishListItem,
);
router.delete("/:productId",auth([UserRole.CUSTOMER]), WishListItemControllers.deleteWishListItem);

router.get("/my",auth([UserRole.CUSTOMER]), WishListItemControllers.getMyWishListItems);

const WishListItemRouter = router;
export default WishListItemRouter;

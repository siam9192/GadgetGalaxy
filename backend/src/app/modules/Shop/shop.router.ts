import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import ShopValidations from "./shop.validation";
import ShopControllers from "./shop.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.Vendor),
  validateRequest(ShopValidations.CreateShopValidation),
  ShopControllers.createShop,
);

router.put(
  "/",
  auth(UserRole.Vendor),
  validateRequest(ShopValidations.UpdateShopValidation),
  ShopControllers.updateShop,
);

router.patch(
  "/",
  auth(UserRole.Vendor),
  validateRequest(ShopValidations.ChangeShopBlacklistStatus),
  ShopControllers.changeShopBlacklistStatus,
);

router.get("/", ShopControllers.getShops);

router.get("/blacklisted", ShopControllers.getBlacklistedShops);
router.get(
  "/check-my-shop-exist",
  auth(UserRole.Vendor),
  ShopControllers.getMyShopExistStatus,
);

const ShopRouter = router;

export default ShopRouter;

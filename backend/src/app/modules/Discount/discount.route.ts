import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import DiscountValidations from "./discount.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import DiscountControllers from "./discount.controller";

const router = Router();

router.post(
  "/",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  validateRequest(DiscountValidations.CreateDiscountValidation),
  DiscountControllers.createDiscount,
);

router.put(
  "/:id",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  validateRequest(DiscountValidations.UpdateDiscountValidation),
  DiscountControllers.updateDiscount,
);

router.get(
  "/",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  DiscountControllers.getDiscounts,
);

router.post(
  "/apply",
  auth([UserRole.Customer]),
  validateRequest(DiscountValidations.ApplyDiscountValidation),
  DiscountControllers.applyDiscount,
);

const DiscountRouter = router;

export default DiscountRouter;

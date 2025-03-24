import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import DiscountValidations from "./discount.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import DiscountControllers from "./discount.controller";

const router = Router();

router.post(
  "/",
  validateRequest(DiscountValidations.CreateDiscountValidation),
  DiscountControllers.createDiscount,
);

router.put(
  "/:id",
  validateRequest(DiscountValidations.UpdateDiscountValidation),
  DiscountControllers.updateDiscount,
);

router.get("/", DiscountControllers.getDiscounts);

router.get("/manage", DiscountControllers.getDiscountsForManage);

router.patch(
  "/change-status",
  validateRequest(DiscountValidations.ChangeDiscountStatusValidation),
  DiscountControllers.changeDiscountStatus,
);

router.post(
  "/apply",
  auth([UserRole.CUSTOMER]),
  validateRequest(DiscountValidations.ApplyDiscountValidation),
  DiscountControllers.applyDiscount,
);

const DiscountRouter = router;

export default DiscountRouter;

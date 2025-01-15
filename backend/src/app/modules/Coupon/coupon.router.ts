import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import CouponValidations from "./coupon.validation";
import CouponControllers from "./coupon.controller";

const router = Router();

router.post(
  "/",
  validateRequest(CouponValidations.CreateCouponValidation),
  CouponControllers.createCoupon,
);

const CouponRouter = router;

export default CouponRouter;

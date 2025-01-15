import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import ProductReviewValidations from "./product-review.validation";
import ProductReviewControllers from "./product-review.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.Customer),
  validateRequest(ProductReviewValidations.CreateReviewValidation),
  ProductReviewControllers.createReview,
);

router.post(
  "/response",
  auth(UserRole.Vendor),
  validateRequest(ProductReviewValidations.CreateReviewResponseValidation),
  ProductReviewControllers.createReviewResponse,
);

router.post(
  "/",
  auth(UserRole.Customer),
  validateRequest(ProductReviewValidations.UpdateReviewValidation),
  ProductReviewControllers.updateReview,
);

router.get(
  "/my/not-reviewed",
  auth(UserRole.Customer),
  ProductReviewControllers.getMyNotReviewedProducts,
);

router.get(
  "/my",
  auth(UserRole.Customer),
  ProductReviewControllers.getMyReviews,
);

const ProductReviewRouter = router;

export default ProductReviewRouter;

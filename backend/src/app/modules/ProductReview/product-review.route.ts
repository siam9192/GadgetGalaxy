import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import ProductReviewValidations from "./product-review.validation";
import ProductReviewControllers from "./product-review.controller";

const router = Router();

router.post(
  "/",
  auth([UserRole.CUSTOMER]),
  validateRequest(ProductReviewValidations.CreateReviewValidation),
  ProductReviewControllers.createReview,
);

router.put(
  "/:id",
  auth([UserRole.CUSTOMER]),
  validateRequest(ProductReviewValidations.UpdateReviewValidation),
  ProductReviewControllers.updateReview,
);

router.get(
  "/my/not-reviewed",
  auth([UserRole.CUSTOMER]),
  ProductReviewControllers.getMyNotReviewedProducts,
);

router.get("/product/:id", ProductReviewControllers.getProductReviews);

router.get(
  "/my",
  auth([UserRole.CUSTOMER]),
  ProductReviewControllers.getMyReviews,
);

const ProductReviewRouter = router;

export default ProductReviewRouter;

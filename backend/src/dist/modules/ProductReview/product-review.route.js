"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(
  require("../../middlewares/validateRequest"),
);
const product_review_validation_1 = __importDefault(
  require("./product-review.validation"),
);
const product_review_controller_1 = __importDefault(
  require("./product-review.controller"),
);
const router = (0, express_1.Router)();
router.post(
  "/",
  (0, auth_1.default)([client_1.UserRole.CUSTOMER]),
  (0, validateRequest_1.default)(
    product_review_validation_1.default.CreateReviewValidation,
  ),
  product_review_controller_1.default.createReview,
);
router.post(
  "/",
  (0, auth_1.default)([client_1.UserRole.CUSTOMER]),
  (0, validateRequest_1.default)(
    product_review_validation_1.default.UpdateReviewValidation,
  ),
  product_review_controller_1.default.updateReview,
);
router.get(
  "/my/not-reviewed",
  (0, auth_1.default)([client_1.UserRole.CUSTOMER]),
  product_review_controller_1.default.getMyNotReviewedProducts,
);
router.get(
  "/my",
  (0, auth_1.default)([client_1.UserRole.CUSTOMER]),
  product_review_controller_1.default.getMyReviews,
);
const ProductReviewRouter = router;
exports.default = ProductReviewRouter;

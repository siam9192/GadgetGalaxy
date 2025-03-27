"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const CreateReviewValidation = zod_1.z.object({
  orderItemId: zod_1.z.string({ required_error: "orderItemId is required" }),
  comment: zod_1.z.string({ required_error: "Comment is required" }),
  imagesUrl: zod_1.z.array(zod_1.z.string().url()),
  rating: zod_1.z
    .number()
    .min(1, "Rating minimum 1 and maximum 5")
    .max(5, "Rating minimum 1 and maximum 5"),
});
const CreateReviewResponseValidation = zod_1.z.object({
  reviewId: zod_1.z.string(),
  comment: zod_1.z.string(),
});
const UpdateReviewValidation = zod_1.z
  .object({
    reviewId: zod_1.z.string(),
    rating: zod_1.z.number(),
    comment: zod_1.z.string(),
    imagesUrl: zod_1.z.array(zod_1.z.string().url()),
  })
  .partial();
const ProductReviewValidations = {
  CreateReviewValidation,
  CreateReviewResponseValidation,
  UpdateReviewValidation,
};
exports.default = ProductReviewValidations;

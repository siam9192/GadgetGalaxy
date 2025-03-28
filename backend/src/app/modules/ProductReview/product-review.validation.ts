import { z } from "zod";

const CreateReviewValidation = z.object({
  orderItemId: z.string({ required_error: "orderItemId is required" }),
  comment: z.string({ required_error: "Comment is required" }),
  imagesUrl: z.array(z.string().url()),
  rating: z
    .number()
    .min(1, "Rating minimum 1 and maximum 5")
    .max(5, "Rating minimum 1 and maximum 5"),
});

const CreateReviewResponseValidation = z.object({
  reviewId: z.string(),
  comment: z.string(),
});

const UpdateReviewValidation = z
  .object({
    rating: z.number().optional(),
    comment: z.string().optional(),
    imagesUrl: z.array(z.string().url()).optional(),
  })
  .partial();

const ProductReviewValidations = {
  CreateReviewValidation,
  CreateReviewResponseValidation,
  UpdateReviewValidation,
};

export default ProductReviewValidations;

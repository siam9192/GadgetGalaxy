import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";
import ProductReviewServices from "./product-review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.createReviewIntoDB(
    req.user,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Product review created successfully",
    data: result,
  });
});

const createReviewResponse = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.createReviewResponseIntoDB(
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product review response created successfully",
    data: result,
  });
});

const getMyNotReviewedProducts = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = Pick(req.query, paginationOptionKeys);
    const result = await ProductReviewServices.getMyNotReviewedProductsFromDB(
      req.user,
      paginationOptions as any,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Product review response created successfully",
      ...result
    });
  },
);

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await ProductReviewServices.getMyReviewsFromDB(
    req.user,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Reviews response created successfully",
    ...result,
  });
});

const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await ProductReviewServices.getProductReviewsFromDB(
    req.params.id,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product review retrieved successfully",
    ...result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.updateReviewIntoDB(
    req.user,
    req.params.id,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product review updated successfully",
    data: result,
  });
});

const ProductReviewControllers = {
  createReview,
  createReviewResponse,
  getMyNotReviewedProducts,
  getProductReviews,
  updateReview,
  getMyReviews,
};

export default ProductReviewControllers;

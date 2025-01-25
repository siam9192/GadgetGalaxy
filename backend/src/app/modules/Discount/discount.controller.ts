import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import DiscountServices from "./discount.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";
import { IPaginationOptions } from "../../interfaces/pagination";

const createDiscount = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountServices.createDiscountIntoDB(
    req.user,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Discount created successfully",
    data: result,
  });
});

const updateDiscount = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountServices.updateDiscountIntoDB(
    req.user,
    req.params.id,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Discount updated successfully",
    data: result,
  });
});

const getDiscounts = catchAsync(async (req: Request, res: Response) => {
  const filter = Pick(req.query, [
    "code",
    "startDate",
    "endDate",
    "validFrom",
    "validUntil",
    "status",
  ]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await DiscountServices.getDiscountsFromDB(
    filter,
    paginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Discounts retrieved successfully",
    ...result,
  });
});

const applyDiscount = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountServices.applyDiscount(req.user, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Discount applied successfully",
    data: result,
  });
});

const DiscountControllers = {
  createDiscount,
  updateDiscount,
  getDiscounts,
  applyDiscount,
};

export default DiscountControllers;

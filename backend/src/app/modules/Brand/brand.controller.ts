import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import BrandServices from "./brand.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandServices.createBrandIntoDB(req.user, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Brand created successfully",
    data: result,
  });
});

const getBrands = catchAsync(async (req: Request, res: Response) => {
  const filter = Pick(req.query, ["searchTerm", "origin"]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await BrandServices.getBrandsFromDB(filter, paginationOptions);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Brand created successfully",
    ...result,
  });
});

const getPopularBrands = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await BrandServices.getPopularBrandsFromDB(paginationOptions);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Brand created successfully",
    ...result,
  });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandServices.updateBrandIntoDB(
    req.user,
    req.params.id,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Brand updated successfully",
    data: result,
  });
});

const BrandControllers = {
  createBrand,
  getBrands,
  getPopularBrands,
  updateBrand,
};

export default BrandControllers;

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
    message: "Brands retrieved successfully",
    ...result,
  });
});
const getBrandsForManage = catchAsync(async (req: Request, res: Response) => {
  const filter = Pick(req.query, ["searchTerm", "origin"]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await BrandServices.getBrandsForManageFromDB(
    filter,
    paginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Brands retrieved successfully",
    ...result,
  });
});

const getPopularBrands = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await BrandServices.getPopularBrandsFromDB(paginationOptions);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Popular Brands retrieved successfully",
    ...result,
  });
});

const getTopBrands = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await BrandServices.getTopBrandsFromDB(paginationOptions);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Top Brands retrieved successfully",
    ...result,
  });
});

const getFeaturedBrands = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await BrandServices.getPopularBrandsFromDB(paginationOptions);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Featured Brands retrieved successfully",
    ...result,
  });
});

const getSearchRelatedBrands = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = Pick(req.query, ["searchTerm"]);
    const result =
      await BrandServices.getSearchRelatedBrandsFromDB(paginationOptions);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Related Brands retrieved successfully",
      data: result,
    });
  },
);

const getCategoryRelatedBrands = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BrandServices.getCategoryRelatedBrandsFromDB(
      req.params.slug,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Related Brands retrieved successfully",
      data: result,
    });
  },
);

const getSearchKeywordBrands = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BrandServices.getSearchKeywordBrandsFromDB(
      req.params.keyword,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Related Brands retrieved successfully",
      data: result,
    });
  },
);

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
  getBrandsForManage,
  getFeaturedBrands,
  getSearchRelatedBrands,
  getCategoryRelatedBrands,
  getPopularBrands,
  getTopBrands,
  getSearchKeywordBrands,
  updateBrand,
};

export default BrandControllers;

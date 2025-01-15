import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import CategoryServices from "./category.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.createCategoryIntoDB(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Category created  successfully",
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const filterOptions = Pick(req.query, ["searchTerm", "parentId"]);
  const options = Pick(req.query, paginationOptionKeys);
  const result = await CategoryServices.getCategoriesFromDB(
    filterOptions,
    options as any,
  );

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPopularCategories = catchAsync(async (req: Request, res: Response) => {
  const filterOptions = Pick(req.query, ["searchTerm", "parentId"]);
  const options = Pick(req.query, paginationOptionKeys);
  const result = await CategoryServices.getPopularCategoriesFromDB();

  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Popular Categories retrieved successfully",
    data: result,
  });
});

const getFeaturedCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryServices.getFeaturedCategoriesFromDB();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Featured Categories retrieved successfully",
      data: result,
    });
  },
);

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.updateCategoryIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: result,
  });
});

const CategoryControllers = {
  createCategory,
  getCategories,
  getPopularCategories,
  getFeaturedCategories,
  updateCategory,
};

export default CategoryControllers;

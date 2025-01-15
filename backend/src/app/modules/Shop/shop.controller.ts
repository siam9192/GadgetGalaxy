import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import ShopServices from "./shop.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";

const createShop = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopServices.createShopIntoDB(req.user, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Shop created successfully",
    data: result,
  });
});

const updateShop = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopServices.updateShopIntoDB(req.user, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Shop updated successfully",
    data: result,
  });
});

const changeShopBlacklistStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ShopServices.changeShopBlacklistStatus(
      req.params.shopId,
      req.body,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Shop blacklist status updated successfully",
      data: result,
    });
  },
);

const getShops = catchAsync(async (req: Request, res: Response) => {
  const filterData = Pick(req.query, ["searchTerm"]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await ShopServices.getShopsFromDB(
    filterData,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Shops retrieved successfully",
    ...result,
  });
});

const getBlacklistedShops = catchAsync(async (req: Request, res: Response) => {
  const filterData = Pick(req.query, ["searchTerm"]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await ShopServices.getBlacklistedShopsFromDB(
    filterData,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Blacklisted shops retrieved successfully",
    ...result,
  });
});

const getMyShopExistStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopServices.getMyShopExistStatusFromDB(req.user);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "My shop exist status retrieved successfully!",
    data: result,
  });
});

const ShopControllers = {
  createShop,
  updateShop,
  changeShopBlacklistStatus,
  getShops,
  getBlacklistedShops,
  getMyShopExistStatus,
};
export default ShopControllers;

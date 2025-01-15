import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import httpStatus from "../../shared/http-status";
import { sendSuccessResponse } from "../../shared/response";
import FollowerServices from "./follower.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";

const createFollower = catchAsync(async (req: Request, res: Response) => {
  const result = await FollowerServices.createFollowerIntoDB(
    req.user,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Follower created successfully",
    data: result,
  });
});

const deleteFollower = catchAsync(async (req: Request, res: Response) => {
  const result = await FollowerServices.deleteFollowerFromDB(
    req.user,
    req.params.shopId,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Follower deleted successfully",
    data: result,
  });
});

const getMyShopFollowers = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await FollowerServices.getMyShopFollowersFromDB(
    req.user,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Followers retrieved successfully",
    ...result,
  });
});

const getMyFollowingShops = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await FollowerServices.getMyFollowingShopsFromDB(
    req.user,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Followers retrieved successfully",
    ...result,
  });
});

const FollowerControllers = {
  createFollower,
  deleteFollower,
  getMyFollowingShops,
  getMyShopFollowers,
};

export default FollowerControllers;

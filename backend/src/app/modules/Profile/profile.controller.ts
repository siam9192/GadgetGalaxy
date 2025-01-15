import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import httpStatus from "../../shared/http-status";
import { sendSuccessResponse } from "../../shared/response";
import ProfileServices from "./profile.service";

const getUserProfileById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProfileServices.getUserProfileByIdFromDB(req.params.id);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const getCurrentUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProfileServices.getUserProfileByIdFromDB(
      req.params.id,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "User profile retrieved successfully",
      data: result,
    });
  },
);

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await ProfileServices.updateMyProfileIntoDB(req);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Profile successfully",
    data: result,
  });
});

const ProfileControllers = {
  getUserProfileById,
  getCurrentUserProfile,
  updateMyProfile,
};

export default ProfileControllers;

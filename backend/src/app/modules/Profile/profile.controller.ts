import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import httpStatus from "../../shared/http-status";
import { sendSuccessResponse } from "../../shared/response";
import ProfileServices from "./profile.service";


const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await ProfileServices.updateMyProfileIntoDB(
    req.user,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });
});

const ProfileControllers = {
  updateMyProfile
};

export default ProfileControllers;

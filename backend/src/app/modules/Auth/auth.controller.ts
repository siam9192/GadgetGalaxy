import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import AuthServices from "./auth.service";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
const parser = require("user-agent-parser");

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Verification OTP has been sent to your email",
    data: result,
  });
});

const verifyRegisterUsingOTP = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthServices.verifyRegistrationUsingOTP(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "OTP verified successfully",
      data: result,
    });
  },
);

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.resendOtp(req.params.token as string);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Otp resend successful",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(res, req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Login successful",
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.logout(req.user);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Logout successful",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.changePassword(req.user, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgetPassword(req.params.email);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Check your mailbox",
    data: result,
  });
});

const getAccessTokenUsingRefreshToken = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthServices.getAccessTokenUsingRefreshToken(req, res);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Access token retrieved successfully",
      data: result,
    });
  },
);

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.resetPassword(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password reset successful",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.getMeFromDB(req.user);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Retrieved successfully",
    data: result,
  });
});
const AuthControllers = {
  register,
  verifyRegisterUsingOTP,
  resendOtp,
  login,
  logout,
  changePassword,
  forgetPassword,
  resetPassword,
  getAccessTokenUsingRefreshToken,
  getMe,
};

export default AuthControllers;

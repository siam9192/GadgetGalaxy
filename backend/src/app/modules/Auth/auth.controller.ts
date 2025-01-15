import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import AuthServices from "./auth.service";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";

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
    const result = await AuthServices.verifyRegisterUsingOTP(req.body);
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
  const result = await AuthServices.login(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Login successful",
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

const AuthControllers = {
  register,
  verifyRegisterUsingOTP,
  resendOtp,
  login,
  changePassword,
};

export default AuthControllers;

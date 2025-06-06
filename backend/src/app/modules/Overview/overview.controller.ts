import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import OverviewServices from "./overview.service";

const getAllOverviewData = catchAsync(async (req: Request, res: Response) => {
  const result = await OverviewServices.getAllOverviewDataFromDB();
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Overview data retrieved successfully",
    data: result,
  });
});

const getOrdersOverviewData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OverviewServices.getOrdersOverviewFromDB();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Overview data retrieved successfully",
      data: result,
    });
  },
);

const getMyOverviewData = catchAsync(async (req: Request, res: Response) => {
  const result = await OverviewServices.getMyOverviewDataFromDB(req.user);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Overview data retrieved successfully",
    data: result,
  });
});

const OverviewControllers = {
  getAllOverviewData,
  getOrdersOverviewData,
  getMyOverviewData,
};

export default OverviewControllers;

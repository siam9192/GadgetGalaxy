import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import UtilServices from "./util.service";

const getSearchKeywordResults = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UtilServices.getSearchKeywordResultsFromDB(
      req.params.keyword,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Retrieved successfully",
      data: result,
    });
  },
);

const getUtilCounts = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UtilServices.getMyUtilCountsFromDB(req.user);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Retrieved successfully",
      data: result,
    });
  },
);

const UtilControllers = {
  getSearchKeywordResults,
  getUtilCounts,
};

export default UtilControllers;

import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";
import ActivityLogServices from "./administratorActivityLog.service";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";

const getActivityLogs = catchAsync(async (req: Request, res: Response) => {
  const filter = Pick(req.query, ["staffId", "startDate", "endDate"]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await ActivityLogServices.getActivityLogsFromDB(
    req.user,
    filter,
    paginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Activity logs retrieved successfully",
    ...result,
  });
});

const deleteActivity = catchAsync(async (req: Request, res: Response) => {
  const result = await ActivityLogServices.deleteActivityFromDB(req.params.id);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Activity logs retrieved successfully",
    data: result,
  });
});

const getAdministratorActivityLogs = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = Pick(req.query, paginationOptionKeys);
    const result = await ActivityLogServices.getAdministratorActivities(
      req.params.id,
      paginationOptions,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Activity logs retrieved successfully",
      data: result,
    });
  },
);

const ActivityLogControllers = {
  getActivityLogs,
  deleteActivity,
  getAdministratorActivityLogs,
};

export default ActivityLogControllers;

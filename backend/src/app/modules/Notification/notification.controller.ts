import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import NotificationServices from "./notification.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";

import { IPaginationOptions } from "../../interfaces/pagination";

const createNotification = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationServices.createNotificationIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Notification created successfully",
    data: result,
  });
});

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const filter = Pick(req.query, ["userId", "type", "startDate", "endDate"]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await NotificationServices.getNotificationsFromDB(
    filter,
    paginationOptionKeys as IPaginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Notifications retrieved successfully",
    data: result,
  });
});

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await NotificationServices.getMyNotificationsFromDB(
    req.user,
    paginationOptionKeys as IPaginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Notifications retrieved successfully",
    data: result,
  });
});

const notificationsSetAsRead = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationServices.notificationsSetAsReadIntoDB(
      req.user,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Notifications updated successfully",
      data: result,
    });
  },
);

const NotificationControllers = {
  createNotification,
  getNotifications,
  getMyNotifications,
  notificationsSetAsRead,
};

export default NotificationControllers;

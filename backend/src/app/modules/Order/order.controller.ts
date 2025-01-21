import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import OrderServices from "./order.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";

const initOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.initOrderIntoDB(req.user, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Order init successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.params, paginationOptionKeys);
  const result = await OrderServices.getMyOrdersFromDB(
    req.user,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Orders retrieved successfully",
    data: result,
  });
});

const OrderControllers = {
  initOrder,
  getMyOrders,
};

export default OrderControllers;

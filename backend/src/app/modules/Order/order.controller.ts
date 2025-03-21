import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import OrderServices from "./order.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IFilterMyOrder } from "./order.interface";

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
  const filter = Pick(req.query, ["status", "startDate", "endDate"]);

  const result = await OrderServices.getMyOrdersFromDB(
    req.user,
    filter as IFilterMyOrder,
    paginationOptions as IPaginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Orders retrieved successfully",
    data: result,
  });
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const filter = Pick(req.query, [
    "customerId",
    "orderId",
    "status",
    "orderDate",
  ]);

  const result = await OrderServices.getOrdersFromDB(
    filter,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Orders retrieved successfully",
    ...result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getOrderByIdFromDB(
    req.user,
    req.params.id,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Order retrieved successfully",
    data: result,
  });
});

const getNotReviewedOrderItems = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = Pick(req.query, paginationOptionKeys);
    const result = await OrderServices.getNotReviewedOrderItemsFromDB(
      req.user,
      paginationOptions,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Retrieved successfully",
      data: result,
    });
  },
);

const UpdateOrderStatusByStaff = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderServices.UpdateOrderStatusByStaffIntoDB(
      req.user,
      req.body,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Order status updated successfully",
      data: result,
    });
  },
);

const OrderControllers = {
  initOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  getNotReviewedOrderItems,
  UpdateOrderStatusByStaff,
};

export default OrderControllers;

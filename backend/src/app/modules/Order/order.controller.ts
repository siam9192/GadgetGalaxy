import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import OrderServices from "./order.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IMyOrderFilterQuery } from "./order.interface";

const initOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.initOrderIntoDB(req.user, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Order init successfully",
    data: result,
  });
});

const placeOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.PlaceOrderIntoDB(req.user, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Order placed successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys)
  const filter = Pick(req.query, ["status", "startDate", "endDate"]);

  const result = await OrderServices.getMyOrdersFromDB(
    req.user,
    filter as IMyOrderFilterQuery,
    paginationOptions as IPaginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Orders retrieved successfully",
    ...result,
  });
});

const getOrdersForManage = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const filter = Pick(req.query, [
    "customerId",
    "orderId",
    "status",
    "startDare",
    "endDate",
  ]);

  const result = await OrderServices.getOrdersForManageFromDB(
    filter,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Orders retrieved successfully",
    ...result,
  });
});

const getStockOutProducts = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.params, paginationOptionKeys);

  const result = await OrderServices.getStockOutProductsFromDB(
    paginationOptions as IPaginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Stock out products retrieved successfully",
    data: result,
  });
});

const getOrderByIdForManage = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderServices.getOrderByIdForManageFromDB(
      req.params.id,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Order retrieved successfully",
      data: result,
    });
  },
);

const getMyOrderById = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getMyOrderByIdFromDB(
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

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.updateOrderStatusIntoDB(
    req.user,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Order status updated successfully",
    data: result,
  });
});

const cancelOrderIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.cancelMyOrderIntoDB(
    req.user,
    req.params.id,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Order canceled successfully",
    data: result,
  });
});


const getRecentOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getRecentOrdersFromDB(
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Recent orders retrieved  successfully",
    data: result,
  });
});

const OrderControllers = {
  initOrder,
  placeOrder,
  getMyOrders,
  getOrdersForManage,
  getOrderByIdForManage,
  getMyOrderById,
  getStockOutProducts,
  getNotReviewedOrderItems,
  updateOrderStatus,
  cancelOrderIntoDB,
  getRecentOrders
};

export default OrderControllers;

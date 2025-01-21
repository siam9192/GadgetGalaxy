import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import httpStatus from "../../shared/http-status";

import ShippingChargeServices from "./shipping-charge.service";
import { sendSuccessResponse } from "../../shared/response";

const createShippingCharge = catchAsync(async (req: Request, res: Response) => {
  const result = await ShippingChargeServices.createShippingChargeIntoDB(
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Shipping charge created successfully",
    data: result,
  });
});

const getShippingCharges = catchAsync(async (req: Request, res: Response) => {
  const result = await ShippingChargeServices.getShippingChargesFromDB();
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Shipping charges retrieved successfully",
    data: result,
  });
});

const updateShippingCharge = catchAsync(async (req: Request, res: Response) => {
  const result = await ShippingChargeServices.updateShippingChargeIntoDB(
    req.params.shippingChargeId,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Shipping charge updated successfully",
    data: result,
  });
});

const deleteShippingChargeById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ShippingChargeServices.deleteShippingChargeByIdFromDB(
      req.params.id,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Shipping charge deleted successfully",
      data: result,
    });
  },
);

const ShippingChargeControllers = {
  createShippingCharge,
  getShippingCharges,
  updateShippingCharge,
  deleteShippingChargeById,
};

export default ShippingChargeControllers;

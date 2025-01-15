import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import PaymentServices from "./payment.service";

const updateSuccessPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.updateSuccessPayment(
    res,
    req.params.paymentId,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "",
    data: result,
  });
});

const updateCancelledPayment = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PaymentServices.updateSuccessPayment(
      res,
      req.params.paymentId,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "",
      data: result,
    });
  },
);

const PaymentControllers = {
  updateCancelledPayment,
  updateSuccessPayment,
};

export default PaymentControllers;

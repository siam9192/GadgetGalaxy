import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import PaymentServices from "./payment.service";

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.validatePayment(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment validation successful",
    data: result,
  });
});

const PaymentControllers = {
  validatePayment,
};

export default PaymentControllers;

import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import PaymentServices from "./payment.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.checkPayment(req.query as any);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment validation successful",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await PaymentServices.getMyPaymentsFromDB(
    req.user,
    paginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payments retrieved successful",
    data: result,
  });
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const filter = Pick(req.query, [
    "minAmount",
    "maxAmount",
    "startDate",
    "endDate",
    "status",
    "customerId",
  ]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await PaymentServices.getPaymentsFromForManageDB(
    filter,
    paginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payments retrieved successful",
    data: result,
  });
});

const checkPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.checkPayment(req.query as any);
  res.redirect(result.url!);
});

const PaymentControllers = {
  validatePayment,
  checkPayment,
  getMyPayments,
  getPayments,
};

export default PaymentControllers;

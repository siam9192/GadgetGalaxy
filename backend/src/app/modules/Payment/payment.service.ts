import {
  OrderPaymentStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import prisma from "../../shared/prisma";
import { Response } from "express";
import { IFilterPayments, IInitPaymentPayload } from "./payment.interface";
import { generateTransactionId } from "../../utils/function";
import SSLServices from "../SSL/ssl.service";
import { IInitSSLPaymentPayload } from "../SSL/ssl.interface";
import config from "../../config";
import { IAuthUser } from "../Auth/auth.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import OrderServices from "../Order/order.service";

const initPayment = async (payload: IInitPaymentPayload) => {
  let transactionId;

  // Generate unique tran id
  while (!transactionId) {
    const generatedTranId = generateTransactionId();
    const payment = await prisma.payment.findUnique({
      where: {
        transactionId: generatedTranId,
      },
    });
    if (payment) {
      continue;
    } else transactionId = generatedTranId;
  }
  console.log("Tran id", transactionId);
  const SSLInitPayload: IInitSSLPaymentPayload = {
    transactionId,
    amount: payload.amount,
    url: {
      success: config.ssl.success_url as string,
      cancel: config.ssl.success_url as string,
      fail: config.ssl.success_url as string,
    },
    customer: payload.customer,
    shippingAddress: payload.shippingAddress,
  };

  const result = await SSLServices.initPayment(SSLInitPayload);

  // Insert  payment into db
  const createdPayment = await prisma.payment.create({
    data: {
      transactionId,
      orderId: payload.orderId,
      amount: payload.amount,
      method: PaymentMethod.SSLCommerz,
      gatewayGatewayData: result,
    },
  });

  return {
    paymentId: createdPayment.id,
    paymentUrl: result.GatewayPageURL,
  };
};
const validatePayment = async (payload: any) => {
  // if (!payload || !payload.status || !(payload.status === 'VALID')) {
  //     return {
  //         message: "Invalid Payment!"
  //     }
  // }

  // const response = await SSLService.validatePayment(payload);

  // if (response?.status !== 'VALID') {
  //     return {
  //         message: "Payment Failed!"
  //     }
  // }

  const response = payload;

  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.Successful,
        gatewayGatewayData: response,
      },
    });
    await OrderServices.PlaceOrderAfterPaymentIntoDB(
      updatedPaymentData.orderId,
      tx,
    );
  });

  return {
    message: "Payment success!",
  };
};

const getMyPaymentsFromDB = async (
  authUser: IAuthUser,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, page, orderBy, sortOrder } =
    calculatePagination(paginationOptions);

  const whereConditions: Prisma.PaymentWhereInput = {
    order: {
      customerId: authUser.customerId!,
    },
    status: PaymentStatus.Successful,
  };
  const data = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });
  const total = await prisma.payment.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit,
    total,
  };
  return {
    data,
    meta,
  };
};

const getPaymentsFromDB = async (
  filter: IFilterPayments,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, page, orderBy, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.PaymentWhereInput[] = [];

  const { minAmount, maxAmount, startDate, endDate, status, customerId } =
    filter;

  if (minAmount || maxAmount) {
    const validate = (amount: string) => {
      return !isNaN(parseInt(amount));
    };

    if (minAmount && validate(minAmount) && maxAmount && validate(maxAmount)) {
      andConditions.push({
        amount: {
          gte: parseInt(minAmount),
          lte: parseInt(maxAmount),
        },
      });
    } else if (minAmount && validate(minAmount)) {
      andConditions.push({
        amount: {
          gte: parseInt(minAmount),
        },
      });
    } else if (maxAmount && validate(maxAmount)) {
      andConditions.push({
        amount: {
          lte: parseInt(maxAmount),
        },
      });
    }
  }

  if (startDate || endDate) {
    const validate = (date: string) => {
      return !isNaN(new Date(date).getTime());
    };

    if (startDate && validate(startDate) && endDate && validate(endDate)) {
      andConditions.push({
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      });
    } else if (startDate && validate(startDate)) {
      andConditions.push({
        createdAt: {
          gte: new Date(startDate),
        },
      });
    } else if (endDate && validate(endDate)) {
      andConditions.push({
        createdAt: {
          lte: new Date(endDate),
        },
      });
    }
  }

  if (status) {
    andConditions.push({
      status,
    });
  }

  if (customerId) {
    andConditions.push({
      order: {
        customerId,
      },
    });
  }
  const whereConditions: Prisma.PaymentWhereInput = {
    AND: andConditions,
  };

  const data = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });
  const total = await prisma.payment.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit,
    total,
  };
  return {
    data,
    meta,
  };
};

const PaymentServices = {
  initPayment,
  validatePayment,
  getMyPaymentsFromDB,
  getPaymentsFromDB,
};

export default PaymentServices;

import {
  OrderPaymentStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import prisma from "../../shared/prisma";
import {
  ICheckPaymentQuery,
  IFilterPayments,
  IInitPaymentPayload,
} from "./payment.interface";
import { generateTransactionId } from "../../utils/function";
import SSLServices from "../SSL/ssl.service";
import { IInitSSLPaymentPayload } from "../SSL/ssl.interface";
import config from "../../config";
import { IAuthUser } from "../Auth/auth.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import jwtHelpers from "../../shared/jwtHelpers";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import OrderServices from "../Order/order.service";

const initPayment = async (payload: IInitPaymentPayload) => {
  let transactionId = generateTransactionId();

  // Generate unique tran id
  while (
    await prisma.payment.findUnique({
      where: {
        transactionId: transactionId,
      },
    })
  ) {
    transactionId = generateTransactionId();
  }

  if (payload.method === PaymentMethod.COD) {
    // Insert  payment into db
    const createdPayment = await prisma.payment.create({
      data: {
        transactionId,
        amount: payload.amount,
        method: PaymentMethod.COD,
      },
    });

    return {
      paymentId: createdPayment.id,
    };
  } else {
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
        amount: payload.amount,
        method: PaymentMethod.SSLCOMMERZ,
        gatewayGatewayData: result,
      },
    });

    return {
      paymentId: createdPayment.id,
      paymentUrl: result.GatewayPageURL,
    };
  }
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
    status: PaymentStatus.SUCCESS,
  };
  const payments = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });
  const totalResult = await prisma.payment.count({
    where: whereConditions,
  });

  const total = await prisma.payment.count({
    where: {
      customerId: authUser.customerId,
    },
  });

  const data = payments.map((payment) => {
    const { gatewayGatewayData, ...main } = payment;
    return main;
  });

  const meta = {
    page,
    limit,
    totalResult,
    total,
  };
  return {
    data,
    meta,
  };
};

const getPaymentsFromForManageDB = async (
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

  if (customerId && !Number.isNaN(customerId)) {
    andConditions.push({
      order: {
        customerId: Number(customerId),
      },
    });
  }

  const whereConditions: Prisma.PaymentWhereInput = {
    AND: andConditions,
  };

  const payments = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });
  const totalResult = await prisma.payment.count({
    where: whereConditions,
  });

  const total = await prisma.payment.count();

  const data = payments.map((payment) => {
    const { gatewayGatewayData, ...main } = payment;
    return main;
  });

  const meta = {
    page,
    limit,
    totalResult,
    total,
  };
  return {
    data,
    meta,
  };
};

const checkPayment = async (query: ICheckPaymentQuery) => {
  try {
    if (!query.token) throw new Error();
    const decode = (await jwtHelpers.verifyToken(
      query.token,
      config.jwt.payment_secret as string,
    )) as { transactionId: string };
    if (!decode) throw new AppError(httpStatus.BAD_REQUEST, "Bad request");

    let url;
    const payment = await prisma.payment.findUnique({
      where: {
        transactionId: decode.transactionId,
      },
      include: {
        order: true,
      },
    });

    if (!payment) throw new Error();

    await prisma.$transaction(async (tx) => {
      switch (query.status) {
        case "SUCCESS":
          await OrderServices.placeOrderAfterSuccessfulPaymentIntoDB(
            payment.id,
            tx,
          );
          url = config.payment.success_url;
        case "CANCELED":
          await tx.payment.update({
            where: {
              id: payment.id,
            },
            data: {
              status: PaymentStatus.CANCELED,
            },
          });
          config.payment.cancel_url;
          await OrderServices.manageUnsuccessfulOrdersIntoDB(
            "FAILED",
            payment.order!.id,
            tx,
          );
        case "FAILED":
          await tx.payment.update({
            where: {
              id: payment.id,
            },
            data: {
              status: PaymentStatus.CANCELED,
            },
          });

          await OrderServices.manageUnsuccessfulOrdersIntoDB(
            "FAILED",
            payment.order!.id,
            tx,
          );
          config.payment.cancel_url;
      }
    });
    return {
      url,
    };
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Bad request");
  }
};

const PaymentServices = {
  initPayment,
  getMyPaymentsFromDB,
  getPaymentsFromForManageDB,
  checkPayment,
};

export default PaymentServices;

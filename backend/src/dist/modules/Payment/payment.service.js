"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const function_1 = require("../../utils/function");
const ssl_service_1 = __importDefault(require("../SSL/ssl.service"));
const config_1 = __importDefault(require("../../config"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const jwtHelpers_1 = __importDefault(require("../../shared/jwtHelpers"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const order_service_1 = __importDefault(require("../Order/order.service"));
const initPayment = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let transactionId = (0, function_1.generateTransactionId)();
    // Generate unique tran id
    while (
      yield prisma_1.default.payment.findUnique({
        where: {
          transactionId: transactionId,
        },
      })
    ) {
      transactionId = (0, function_1.generateTransactionId)();
    }
    if (payload.method === client_1.PaymentMethod.COD) {
      // Insert  payment into db
      const createdPayment = yield prisma_1.default.payment.create({
        data: {
          transactionId,
          amount: payload.amount,
          method: client_1.PaymentMethod.COD,
        },
      });
      return {
        paymentId: createdPayment.id,
      };
    } else {
      const SSLInitPayload = {
        transactionId,
        amount: payload.amount,
        url: {
          success: config_1.default.ssl.success_url,
          cancel: config_1.default.ssl.success_url,
          fail: config_1.default.ssl.success_url,
        },
        customer: payload.customer,
        shippingAddress: payload.shippingAddress,
      };
      const result = yield ssl_service_1.default.initPayment(SSLInitPayload);
      // Insert  payment into db
      const createdPayment = yield prisma_1.default.payment.create({
        data: {
          transactionId,
          amount: payload.amount,
          method: client_1.PaymentMethod.SSLCOMMERZ,
          gatewayGatewayData: result,
        },
      });
      return {
        paymentId: createdPayment.id,
        paymentUrl: result.GatewayPageURL,
      };
    }
  });
const getMyPaymentsFromDB = (authUser, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page, orderBy, sortOrder } = (0,
    paginationHelper_1.calculatePagination)(paginationOptions);
    const whereConditions = {
      order: {
        customerId: authUser.customerId,
      },
      status: client_1.PaymentStatus.SUCCESS,
    };
    const payments = yield prisma_1.default.payment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        [orderBy]: sortOrder,
      },
    });
    const totalResult = yield prisma_1.default.payment.count({
      where: whereConditions,
    });
    const total = yield prisma_1.default.payment.count({
      where: {
        customerId: authUser.customerId,
      },
    });
    const data = payments.map((payment) => {
      const { gatewayGatewayData } = payment,
        main = __rest(payment, ["gatewayGatewayData"]);
      return main;
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
  });
const getPaymentsFromForManageDB = (filter, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page, orderBy, sortOrder } = (0,
    paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    const { minAmount, maxAmount, startDate, endDate, status, customerId } =
      filter;
    if (minAmount || maxAmount) {
      const validate = (amount) => {
        return !isNaN(parseInt(amount));
      };
      if (
        minAmount &&
        validate(minAmount) &&
        maxAmount &&
        validate(maxAmount)
      ) {
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
      const validate = (date) => {
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
    const whereConditions = {
      AND: andConditions,
    };
    const payments = yield prisma_1.default.payment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        [orderBy]: sortOrder,
      },
    });
    const totalResult = yield prisma_1.default.payment.count({
      where: whereConditions,
    });
    const total = yield prisma_1.default.payment.count();
    const data = payments.map((payment) => {
      const { gatewayGatewayData } = payment,
        main = __rest(payment, ["gatewayGatewayData"]);
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
  });
const checkPayment = (query) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!query.token) throw new Error();
      const decode = yield jwtHelpers_1.default.verifyToken(
        query.token,
        config_1.default.jwt.payment_secret,
      );
      if (!decode)
        throw new AppError_1.default(
          http_status_1.default.BAD_REQUEST,
          "Bad request",
        );
      let url;
      const payment = yield prisma_1.default.payment.findUnique({
        where: {
          transactionId: decode.transactionId,
        },
        include: {
          order: true,
        },
      });
      if (!payment) throw new Error();
      yield prisma_1.default.$transaction((tx) =>
        __awaiter(void 0, void 0, void 0, function* () {
          switch (query.status) {
            case "SUCCESS":
              yield order_service_1.default.placeOrderAfterSuccessfulPaymentIntoDB(
                payment.id,
                tx,
              );
              url = config_1.default.payment.success_url;
            case "CANCELED":
              yield tx.payment.update({
                where: {
                  id: payment.id,
                },
                data: {
                  status: client_1.PaymentStatus.CANCELED,
                },
              });
              config_1.default.payment.cancel_url;
              yield order_service_1.default.manageUnsuccessfulOrdersIntoDB(
                "FAILED",
                payment.order.id,
                tx,
              );
            case "FAILED":
              yield tx.payment.update({
                where: {
                  id: payment.id,
                },
                data: {
                  status: client_1.PaymentStatus.CANCELED,
                },
              });
              yield order_service_1.default.manageUnsuccessfulOrdersIntoDB(
                "FAILED",
                payment.order.id,
                tx,
              );
              config_1.default.payment.cancel_url;
          }
        }),
      );
      return {
        url,
      };
    } catch (error) {
      throw new AppError_1.default(
        http_status_1.default.BAD_REQUEST,
        "Bad request",
      );
    }
  });
const PaymentServices = {
  initPayment,
  getMyPaymentsFromDB,
  getPaymentsFromForManageDB,
  checkPayment,
};
exports.default = PaymentServices;

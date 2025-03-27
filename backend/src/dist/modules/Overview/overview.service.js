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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllOverviewDataFromDB = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userWhereConditions = {
      status: {
        not: client_1.UserStatus.DELETED,
      },
    };
    const totalUsers = yield prisma_1.default.user.count({
      where: userWhereConditions,
    });
    const totalOrders = yield prisma_1.default.order.count({
      where: {
        status: {
          not: {
            in: [client_1.OrderStatus.PENDING, client_1.OrderStatus.FAILED],
          },
        },
      },
    });
    const totalReviews = yield prisma_1.default.productReview.count();
    const totalCustomers = yield prisma_1.default.customer.count({
      where: {
        user: userWhereConditions,
      },
    });
    const totalAdministrators = yield prisma_1.default.administrator.count({
      where: {
        user: userWhereConditions,
      },
    });
    const totalRevenue = yield prisma_1.default.payment.aggregate({
      _sum: {
        amount: true,
      },
    });
    const totalBrands = yield prisma_1.default.brand.count();
    return {
      totalUsers,
      totalCustomers,
      totalAdministrators,
      totalBrands,
      totalOrders,
      totalReviews,
      totalRevenue,
    };
  });
const getUsersOverviewFromDB = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userWhereConditions = {
      status: {
        not: client_1.UserStatus.DELETED,
      },
    };
    const total = yield prisma_1.default.user.count({
      where: userWhereConditions,
    });
    const totalActive = yield prisma_1.default.user.count({
      where: {
        status: client_1.UserStatus.ACTIVE,
      },
    });
    const totalBlocked = yield prisma_1.default.user.count({
      where: {
        status: client_1.UserStatus.BLOCKED,
      },
    });
    const totalDeleted = yield prisma_1.default.user.count({
      where: {
        status: client_1.UserStatus.DELETED,
      },
    });
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    const endDate = new Date();
    return {
      total,
      totalActive,
      totalBlocked,
      totalDeleted,
    };
  });
const getOrdersOverviewFromDB = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const total = yield prisma_1.default.order.count();
    const group = yield prisma_1.default.order.groupBy({
      by: "status",
      _count: true,
    });
    const totalPlaced =
      ((_a = group.find((_) => _.status === client_1.OrderStatus.PLACED)) ===
        null || _a === void 0
        ? void 0
        : _a._count) || 0;
    const totalProcessing =
      ((_b = group.find(
        (_) => _.status === client_1.OrderStatus.PROCESSING,
      )) === null || _b === void 0
        ? void 0
        : _b._count) || 0;
    const totalInTransit =
      ((_c = group.find(
        (_) => _.status === client_1.OrderStatus.IN_TRANSIT,
      )) === null || _c === void 0
        ? void 0
        : _c._count) || 0;
    const totalDelivered =
      ((_d = group.find((_) => _.status === client_1.OrderStatus.DELIVERED)) ===
        null || _d === void 0
        ? void 0
        : _d._count) || 0;
    const totalFailed =
      ((_e = group.find((_) => _.status === client_1.OrderStatus.FAILED)) ===
        null || _e === void 0
        ? void 0
        : _e._count) || 0;
    const totalCanceled =
      ((_f = group.find((_) => _.status === client_1.OrderStatus.CANCELED)) ===
        null || _f === void 0
        ? void 0
        : _f._count) || 0;
    const totalReturned =
      ((_g = group.find((_) => _.status === client_1.OrderStatus.RETURNED)) ===
        null || _g === void 0
        ? void 0
        : _g._count) || 0;
    return {
      total,
      totalPlaced,
      totalProcessing,
      totalInTransit,
      totalDelivered,
      totalReturned,
      totalCanceled,
      totalFailed,
    };
  });
const getProductsOverviewFromDB = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const whereConditions = {
      status: {
        not: client_1.ProductStatus.DELETED,
      },
    };
    const total = yield prisma_1.default.product.count({
      where: whereConditions,
    });
    const totalActive = yield prisma_1.default.product.count({
      where: {
        status: client_1.ProductStatus.ACTIVE,
      },
    });
    const totalPaused = yield prisma_1.default.product.count({
      where: {
        status: client_1.ProductStatus.PAUSED,
      },
    });
    const totalStockOut = yield prisma_1.default.product.count({
      where: {
        OR: [
          {
            availableQuantity: 0,
          },
          {
            variants: {
              some: {
                availableQuantity: 0,
              },
            },
          },
        ],
        status: {
          not: client_1.ProductStatus.DELETED,
        },
      },
    });
    return {
      total,
      totalActive,
      totalPaused,
      totalStockOut,
    };
  });
const getDiscountOverviewFromDB = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const total = yield prisma_1.default.discount.count();
    const totalActive = yield prisma_1.default.discount.count({
      where: {
        status: client_1.DiscountStatus.ACTIVE,
      },
    });
    const totalPaused = yield prisma_1.default.discount.count({
      where: {
        status: client_1.DiscountStatus.INACTIVE,
      },
    });
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    const endDate = new Date();
    const totalRecentlyAdded = yield prisma_1.default.discount.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return {
      total,
      totalActive,
      totalPaused,
      totalRecentlyAdded,
    };
  });
const getPaymentsOverviewFromDB = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const total = yield prisma_1.default.payment.count({
      where: {
        status: client_1.PaymentStatus.SUCCESS,
      },
    });
    const totalAmount = yield prisma_1.default.payment.aggregate({
      _sum: {
        amount: true,
      },
    });
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    const endDate = new Date();
    const totalRecentPayment = yield prisma_1.default.payment.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    const totalAmountRecentPayment = yield prisma_1.default.payment.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });
    return {
      total,
      totalAmount,
      totalRecentPayment,
      totalAmountRecentPayment,
    };
  });
const OverviewServices = {
  getAllOverviewDataFromDB,
  getUsersOverviewFromDB,
  getOrdersOverviewFromDB,
  getDiscountOverviewFromDB,
  getProductsOverviewFromDB,
  getPaymentsOverviewFromDB,
};
exports.default = OverviewServices;

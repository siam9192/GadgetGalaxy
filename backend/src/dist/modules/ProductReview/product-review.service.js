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
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const http_status_1 = __importDefault(require("../../shared/http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createReviewIntoDB = (authUser, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const orderItem = yield prisma_1.default.orderItem.findUnique({
      where: {
        id: payload.orderItemId,
        order: {
          customerId: authUser.customerId,
          status: client_1.OrderStatus.DELIVERED,
        },
      },
      include: {
        order: {
          select: {
            customerId: true,
          },
        },
      },
    });
    if (!orderItem) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "Order item not found",
      );
    }
    return yield prisma_1.default.$transaction((tx) =>
      __awaiter(void 0, void 0, void 0, function* () {
        yield tx.productReview.create({
          data: {
            customerId: orderItem.order.customerId,
            comment: payload.comment,
            rating: payload.rating,
            imagesUrl: payload.imagesUrl,
            orderItemId: payload.orderItemId,
            productId: orderItem.productId,
          },
        });
        const average = yield tx.productReview.aggregate({
          _avg: {
            rating: true,
          },
          where: {
            productId: orderItem.productId,
          },
        });
        yield tx.product.update({
          where: {
            id: orderItem.productId,
          },
          data: {
            rating: average._avg.rating || 0,
          },
        });
        yield tx.orderItem.update({
          where: {
            id: payload.orderItemId,
          },
          data: {
            isReviewed: true,
          },
        });
      }),
    );
  });
const createReviewResponseIntoDB = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.productReview.update({
      where: {
        id: payload.id,
      },
      data: {
        response: payload.comment,
      },
    });
    return result;
  });
const getMyNotReviewedProductsFromDB = (authUser, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page, orderBy, sortOrder } = (0,
    paginationHelper_1.calculatePagination)(paginationOptions);
    const whereConditions = {
      order: {
        customer: {
          userId: authUser.id,
        },
      },
      isReviewed: false,
    };
    const data = yield prisma_1.default.orderItem.findMany({
      where: whereConditions,
      take: limit,
      skip,
      orderBy: {
        order: {
          [orderBy]: sortOrder,
        },
      },
    });
    const total = yield prisma_1.default.orderItem.count({
      where: whereConditions,
    });
    return {
      data: data,
      meta: {
        total,
        skip,
        limit,
        page,
      },
    };
  });
const getProductReviewsFromDB = (productId, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    productId = Number(productId);
    const { skip, limit, page, orderBy, sortOrder } = (0,
    paginationHelper_1.calculatePagination)(paginationOptions);
    const whereConditions = {
      id: productId,
    };
    const data = yield prisma_1.default.productReview.findMany({
      where: whereConditions,
      take: limit,
      skip,
      orderBy: {
        [orderBy]: sortOrder,
      },
    });
    const total = yield prisma_1.default.productReview.count({
      where: whereConditions,
    });
    return {
      data,
      meta: {
        total,
        skip,
        limit,
        page,
      },
    };
  });
const getMyReviewsFromDB = (authUser, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page, orderBy, sortOrder } = (0,
    paginationHelper_1.calculatePagination)(paginationOptions);
    const whereConditions = {
      customerId: authUser.customerId,
    };
    const data = yield prisma_1.default.productReview.findMany({
      where: whereConditions,
      include: {
        product: {
          select: {
            name: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        },
      },
      take: limit,
      skip,
      orderBy: {
        [orderBy]: sortOrder,
      },
    });
    const total = yield prisma_1.default.productReview.count({
      where: whereConditions,
    });
    const filteredData = data.map((item) => ({
      id: item.id,
      comment: item.comment,
      rating: item.rating,
      response: item.response,
      product: item.product,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    return {
      data: filteredData,
      meta: {
        total,
        skip,
        limit,
        page,
      },
    };
  });
const updateReviewIntoDB = (authUser, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.productReview.findUnique({
      where: {
        id: payload.id,
        customerId: authUser.customerId,
      },
    });
    if (!review) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "Review not found",
      );
    }
    const result = yield prisma_1.default.$transaction((tx) =>
      __awaiter(void 0, void 0, void 0, function* () {
        const updatedReview = yield tx.productReview.update({
          where: {
            id: payload.id,
          },
          data: Object.assign({}, payload),
        });
        const average = yield tx.productReview.aggregate({
          _avg: {
            rating: true,
          },
          where: {
            productId: review.productId,
          },
        });
        yield tx.product.update({
          where: {
            id: review.productId,
          },
          data: {
            rating: average._avg.rating || 0,
          },
        });
        return updatedReview;
      }),
    );
    return result;
  });
const changeReviewStatusIntoDB = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.productReview.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!review)
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "Review not found",
      );
    yield prisma_1.default.productReview.update({
      where: {
        id: payload.id,
      },
      data: {
        status: payload.status,
      },
    });
  });
const ProductReviewServices = {
  createReviewIntoDB,
  createReviewResponseIntoDB,
  getMyNotReviewedProductsFromDB,
  getMyReviewsFromDB,
  getProductReviewsFromDB,
  updateReviewIntoDB,
  changeReviewStatusIntoDB,
};
exports.default = ProductReviewServices;

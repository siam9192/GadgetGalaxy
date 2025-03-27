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
const http_status_1 = __importDefault(require("../../shared/http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const constant_1 = require("../../utils/constant");
const paginationHelper_1 = require("../../helpers/paginationHelper");
const createWishListItemIntoDB = (authUser, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
      where: {
        id: payload.productId,
      },
    });
    if (!product)
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "Product not found",
      );
    return yield prisma_1.default.wishListItem.upsert({
      where: {
        productId_customerId: {
          customerId: authUser.customerId,
          productId: payload.productId,
        },
      },
      update: {
        productId: payload.productId,
      },
      create: {
        customerId: authUser.customerId,
        productId: payload.productId,
      },
    });
  });
const deleteWishListItemFromDB = (authUser, productId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    productId = Number(productId);
    const item = yield prisma_1.default.wishListItem.findUnique({
      where: {
        productId_customerId: {
          customerId: authUser.customerId,
          productId: productId,
        },
      },
    });
    if (!item)
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "Product not found in wishlist",
      );
    yield prisma_1.default.wishListItem.delete({
      where: {
        productId_customerId: {
          customerId: authUser.customerId,
          productId: productId,
        },
      },
    });
  });
const getWishListItemsFromDB = (authUser, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = (0, paginationHelper_1.calculatePagination)(
      paginationOptions,
    );
    const whereConditions = {
      customerId: authUser.customerId,
      product: {
        status: client_1.ProductStatus.ACTIVE,
      },
    };
    const items = yield prisma_1.default.wishListItem.findMany({
      where: whereConditions,
      select: {
        product: {
          select: constant_1.productSelect,
        },
      },
      take: limit,
      skip,
    });
    const totalResult = yield prisma_1.default.wishListItem.count({
      where: whereConditions,
    });
    const data = items.map((_) => Object.assign({}, _.product));
    const meta = {
      page,
      limit,
      totalResult,
    };
    return {
      data,
      meta,
    };
  });
const WishListItemServices = {
  createWishListItemIntoDB,
  deleteWishListItemFromDB,
  getWishListItemsFromDB,
};
exports.default = WishListItemServices;

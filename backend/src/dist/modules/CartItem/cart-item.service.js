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
const createCartItemIntoDB = (authUser, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
      where: {
        id: payload.productId,
        status: {
          not: client_1.ProductStatus.DELETED,
        },
      },
      select: {
        id: true,
        variants: true,
        _count: {
          select: {
            variants: true,
          },
        },
      },
    });
    if (!product)
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "Product not found",
      );
    else if (!payload.variantId && product._count.variants !== 0) {
      throw new AppError_1.default(
        http_status_1.default.BAD_REQUEST,
        "Variant id is required",
      );
    }
    // If variant id exist then check variant existence in db
    if (
      payload.variantId &&
      !product.variants.find((_) => _.id === payload.variantId)
    ) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "Variant not found",
      );
    }
    const whereConditions = {
      customerId: authUser.customerId,
      productId: payload.productId,
    };
    if (payload.variantId) whereConditions.variantId = payload.variantId;
    const cartItem = yield prisma_1.default.cartItem.findFirst({
      where: whereConditions,
    });
    if (cartItem) {
      yield prisma_1.default.cartItem.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: payload.quantity,
        },
      });
    } else {
      yield prisma_1.default.cartItem.create({
        data: {
          customerId: authUser.customerId,
          productId: payload.productId,
          variantId: payload.variantId,
          quantity: payload.quantity,
        },
      });
    }
    return null;
  });
const deleteCartItemFromDB = (authUser, id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.cartItem.delete({
      where: {
        id,
        customerId: authUser.customerId,
      },
    });
    return null;
  });
const getMyCartItemsFromDB = (authUser) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const items = yield prisma_1.default.cartItem.findMany({
      where: {
        customer: {
          userId: authUser.id,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            offerPrice: true,
            images: true,
          },
        },
        variant: true,
      },
    });
    const result = items.map((item) => ({
      id: item.id,
      product: Object.assign(Object.assign({}, item.product), {
        variant: item.variant,
      }),
      quantity: item.quantity,
    }));
    return result;
  });
const changeItemQuantity = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.cartItem.update({
      where: {
        id: payload.id,
      },
      data: {
        quantity: payload.quantity,
      },
    });
    return null;
  });
const changeItemVariantIntoDB = (authUser, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const cartItem = yield prisma_1.default.cartItem.findUnique({
      where: {
        id: payload.id,
        customerId: authUser.customerId,
      },
    });
    if (!cartItem)
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "Cart item not found",
      );
    // Checking is that variant already exist in the cart
    if (
      yield prisma_1.default.cartItem.findFirst({
        where: {
          customerId: authUser.customerId,
          productId: cartItem.productId,
          variantId: payload.variantId,
        },
      })
    ) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        "Already exist",
      );
    }
    yield prisma_1.default.cartItem.update({
      where: {
        id: payload.id,
      },
      data: {
        variantId: payload.variantId,
      },
    });
    return null;
  });
const CartItemServices = {
  createCartItemIntoDB,
  changeItemVariantIntoDB,
  getMyCartItemsFromDB,
  deleteCartItemFromDB,
  changeItemQuantity,
};
exports.default = CartItemServices;

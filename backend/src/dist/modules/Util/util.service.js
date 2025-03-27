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
const prisma_1 = __importDefault(require("../../shared/prisma"));
const constant_1 = require("../../utils/constant");
const getSearchKeywordResultsFromDB = (keyword) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
        isVisible: true,
      },
    });
    const categoriesData = categories.map((category) => ({
      id: category.id,
      name: category.name,
      imageUrl: category.imageUrl,
      slug: category.slug,
    }));
    const products = yield prisma_1.default.product.findMany({
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      take: 12,
      select: constant_1.productSelect,
    });
    const productsData = products.map((product) => {
      const variant = product.variants[0];
      return {
        type: "product",
        name: product.name,
        imageUr: product.images[0],
        price: variant.price || product.price,
        offerPrice: variant.offerPrice || product.offerPrice,
      };
    });
  });
const UtilServices = {
  getSearchKeywordResultsFromDB,
};
exports.default = UtilServices;

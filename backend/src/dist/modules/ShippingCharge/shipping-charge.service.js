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
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createShippingChargeIntoDB = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.shippingCharge.create({
      data: payload,
    });
  });
const getShippingChargesFromDB = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.shippingCharge.findMany();
  });
const getShippingChargesForManageFromDB = (filterQuery, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, deliveryHours } = filterQuery;
    const whereConditions = {};
    //  if(!Number.isNaN(searchTerm)){
    //    whereConditions.id = Number(searchTerm) as number
    //  }
  });
const updateShippingChargeIntoDB = (shippingChargeId, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    shippingChargeId = Number(shippingChargeId);
    // Find the existing shipping charge by ID
    const shippingCharge = yield prisma_1.default.shippingCharge.findUnique({
      where: {
        id: shippingChargeId,
      },
    });
    // If the shipping charge does not exist, throw a "Not Found" error
    if (!shippingCharge) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "Shipping charge not found",
      );
    }
    // Update the shipping charge with the new payload and return the updated record
    return yield prisma_1.default.shippingCharge.update({
      where: {
        id: shippingChargeId,
      },
      data: payload,
    });
  });
const deleteShippingChargeByIdFromDB = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const shippingCharge = yield prisma_1.default.shippingCharge.findUnique({
      where: {
        id,
      },
    });
    if (!shippingCharge) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "Shipping charge not found",
      );
    }
    yield prisma_1.default.shippingCharge.delete({
      where: {
        id,
      },
    });
  });
const ShippingChargeServices = {
  createShippingChargeIntoDB,
  getShippingChargesFromDB,
  updateShippingChargeIntoDB,
  deleteShippingChargeByIdFromDB,
};
exports.default = ShippingChargeServices;

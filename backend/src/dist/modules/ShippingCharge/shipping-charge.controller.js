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
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const shipping_charge_service_1 = __importDefault(
  require("./shipping-charge.service"),
);
const response_1 = require("../../shared/response");
const createShippingCharge = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result =
      yield shipping_charge_service_1.default.createShippingChargeIntoDB(
        req.body,
      );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Shipping charge created successfully",
      data: result,
    });
  }),
);
const getShippingCharges = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result =
      yield shipping_charge_service_1.default.getShippingChargesFromDB();
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Shipping charges retrieved successfully",
      data: result,
    });
  }),
);
const updateShippingCharge = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result =
      yield shipping_charge_service_1.default.updateShippingChargeIntoDB(
        req.params.shippingChargeId,
        req.body,
      );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Shipping charge updated successfully",
      data: result,
    });
  }),
);
const deleteShippingChargeById = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result =
      yield shipping_charge_service_1.default.deleteShippingChargeByIdFromDB(
        req.params.id,
      );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Shipping charge deleted successfully",
      data: result,
    });
  }),
);
const ShippingChargeControllers = {
  createShippingCharge,
  getShippingCharges,
  updateShippingCharge,
  deleteShippingChargeById,
};
exports.default = ShippingChargeControllers;

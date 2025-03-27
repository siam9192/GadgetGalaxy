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
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const jwtHelpers_1 = __importDefault(require("../../shared/jwtHelpers"));
const client_1 = require("@prisma/client");
const initPayment = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const token = jwtHelpers_1.default.generateToken(
      { transactionId: payload.transactionId },
      config_1.default.jwt.payment_secret,
      "12h",
    );
    const data = {
      store_id: config_1.default.ssl.store_id,
      store_passwd: config_1.default.ssl.store_password,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId, // use unique tran_id for each api call
      success_url: `${config_1.default.backend_base_api}/payments/ispn?token=${token}&status=${client_1.PaymentStatus.SUCCESS}`,
      fail_url: `${config_1.default.backend_base_api}/payments/ispn?token=${token}&status=${client_1.PaymentStatus.FAILED}`,
      cancel_url: `${config_1.default.backend_base_api}/payments/ispn?token=${token}&status=${client_1.PaymentStatus.CANCELED}`,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "N/A",
      product_category: "N/A",
      product_profile: "N/A",
      cus_name: payload.customer.name,
      cus_email: payload.customer.email || "N/A",
      cus_add1: "N/A",
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "Bangladesh",
      cus_phone: payload.customer.phone || "N/A",
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "N/A",
      ship_country: "N/A",
    };
    const response = yield (0, axios_1.default)({
      method: "post",
      url: config_1.default.ssl.payment_url,
      data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  });
const validatePayment = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const response = yield (0, axios_1.default)({
        method: "get",
        url: config_1.default.ssl.validation_url,
      });
      return response.data;
    } catch (error) {
      throw new AppError_1.default(
        http_status_1.default.BAD_REQUEST,
        "Payment validation failed!",
      );
    }
  });
const SSLServices = {
  initPayment,
  validatePayment,
};
exports.default = SSLServices;

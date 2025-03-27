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
const response_1 = require("../../shared/response");
const http_status_1 = __importDefault(require("../../shared/http-status"));
const payment_service_1 = __importDefault(require("./payment.service"));
const pick_1 = __importDefault(require("../../utils/pick"));
const constant_1 = require("../../utils/constant");
const validatePayment = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.default.checkPayment(req.query);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Payment validation successful",
      data: result,
    });
  }),
);
const getMyPayments = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result = yield payment_service_1.default.getMyPaymentsFromDB(
      req.user,
      paginationOptions,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Payments retrieved successful",
      data: result,
    });
  }),
);
const getPayments = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, [
      "minAmount",
      "maxAmount",
      "startDate",
      "endDate",
      "status",
      "customerId",
    ]);
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result = yield payment_service_1.default.getPaymentsFromForManageDB(
      filter,
      paginationOptions,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Payments retrieved successful",
      data: result,
    });
  }),
);
const checkPayment = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.default.checkPayment(req.query);
    res.redirect(result.url);
  }),
);
const PaymentControllers = {
  validatePayment,
  checkPayment,
  getMyPayments,
  getPayments,
};
exports.default = PaymentControllers;

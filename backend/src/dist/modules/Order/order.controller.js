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
const order_service_1 = __importDefault(require("./order.service"));
const pick_1 = __importDefault(require("../../utils/pick"));
const constant_1 = require("../../utils/constant");
const initOrder = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.default.initOrderIntoDB(
      req.user,
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Order init successfully",
      data: result,
    });
  }),
);
const placeOrder = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.default.PlaceOrderIntoDB(
      req.user,
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Order placed successfully",
      data: result,
    });
  }),
);
const getMyOrders = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(
      req.params,
      constant_1.paginationOptionKeys,
    );
    const filter = (0, pick_1.default)(req.query, [
      "status",
      "startDate",
      "endDate",
    ]);
    const result = yield order_service_1.default.getMyOrdersFromDB(
      req.user,
      filter,
      paginationOptions,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Orders retrieved successfully",
      data: result,
    });
  }),
);
const getOrdersForManage = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const filter = (0, pick_1.default)(req.query, [
      "customerId",
      "orderId",
      "status",
      "startDare",
      "endDate",
    ]);
    const result = yield order_service_1.default.getOrdersForManageFromDB(
      filter,
      paginationOptions,
    );
    (0, response_1.sendSuccessResponse)(
      res,
      Object.assign(
        {
          statusCode: http_status_1.default.CREATED,
          message: "Orders retrieved successfully",
        },
        result,
      ),
    );
  }),
);
const getStockOutProducts = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(
      req.params,
      constant_1.paginationOptionKeys,
    );
    const result =
      yield order_service_1.default.getStockOutProductsFromDB(
        paginationOptions,
      );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Stock out products retrieved successfully",
      data: result,
    });
  }),
);
const getOrderByIdForManage = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.default.getOrderByIdForManageFromDB(
      req.params.id,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Order retrieved successfully",
      data: result,
    });
  }),
);
const getMyOrderById = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.default.getMyOrderByIdFromDB(
      req.user,
      req.params.id,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Order retrieved successfully",
      data: result,
    });
  }),
);
const getNotReviewedOrderItems = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result = yield order_service_1.default.getNotReviewedOrderItemsFromDB(
      req.user,
      paginationOptions,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Retrieved successfully",
      data: result,
    });
  }),
);
const updateOrderStatus = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.default.updateOrderStatusIntoDB(
      req.user,
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Order status updated successfully",
      data: result,
    });
  }),
);
const OrderControllers = {
  initOrder,
  placeOrder,
  getMyOrders,
  getOrdersForManage,
  getOrderByIdForManage,
  getMyOrderById,
  getStockOutProducts,
  getNotReviewedOrderItems,
  updateOrderStatus,
};
exports.default = OrderControllers;

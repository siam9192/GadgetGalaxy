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
const discount_service_1 = __importDefault(require("./discount.service"));
const pick_1 = __importDefault(require("../../utils/pick"));
const constant_1 = require("../../utils/constant");
const createDiscount = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield discount_service_1.default.createDiscountIntoDB(
      req.user,
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Discount created successfully",
      data: result,
    });
  }),
);
const updateDiscount = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield discount_service_1.default.updateDiscountIntoDB(
      req.user,
      req.params.id,
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Discount updated successfully",
      data: result,
    });
  }),
);
const changeDiscountStatus = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield discount_service_1.default.changeDiscountStatusIntoDB(
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Discount status updated successfully",
      data: result,
    });
  }),
);
const getDiscounts = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, ["code", "validUntil"]);
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result = yield discount_service_1.default.getDiscountsFromDB(
      filter,
      paginationOptions,
    );
    (0, response_1.sendSuccessResponse)(
      res,
      Object.assign(
        {
          statusCode: http_status_1.default.OK,
          message: "Discounts retrieved successfully",
        },
        result,
      ),
    );
  }),
);
const getDiscountsForManage = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, [
      "code",
      "validFrom",
      "validUntil",
      "status",
    ]);
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result = yield discount_service_1.default.getDiscountsFromDB(
      filter,
      paginationOptions,
    );
    (0, response_1.sendSuccessResponse)(
      res,
      Object.assign(
        {
          statusCode: http_status_1.default.OK,
          message: "Discounts retrieved successfully",
        },
        result,
      ),
    );
  }),
);
const applyDiscount = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield discount_service_1.default.applyDiscount(
      req.user,
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Discount applied successfully",
      data: result,
    });
  }),
);
const DiscountControllers = {
  createDiscount,
  updateDiscount,
  changeDiscountStatus,
  getDiscounts,
  getDiscountsForManage,
  applyDiscount,
};
exports.default = DiscountControllers;

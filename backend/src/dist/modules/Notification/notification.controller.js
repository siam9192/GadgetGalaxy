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
const notification_service_1 = __importDefault(
  require("./notification.service"),
);
const pick_1 = __importDefault(require("../../utils/pick"));
const constant_1 = require("../../utils/constant");
const createNotification = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result =
      yield notification_service_1.default.createNotificationIntoDB(req.body);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Notification created successfully",
      data: result,
    });
  }),
);
const getNotifications = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, [
      "userId",
      "type",
      "startDate",
      "endDate",
    ]);
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result = yield notification_service_1.default.getNotificationsFromDB(
      filter,
      constant_1.paginationOptionKeys,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Notifications retrieved successfully",
      data: result,
    });
  }),
);
const getMyNotifications = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result =
      yield notification_service_1.default.getMyNotificationsFromDB(
        req.user,
        constant_1.paginationOptionKeys,
      );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Notifications retrieved successfully",
      data: result,
    });
  }),
);
const notificationsSetAsRead = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result =
      yield notification_service_1.default.notificationsSetAsReadIntoDB(
        req.user,
      );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Notifications updated successfully",
      data: result,
    });
  }),
);
const NotificationControllers = {
  createNotification,
  getNotifications,
  getMyNotifications,
  notificationsSetAsRead,
};
exports.default = NotificationControllers;

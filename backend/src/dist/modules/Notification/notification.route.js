"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(
  require("../../middlewares/validateRequest"),
);
const notification_validation_1 = __importDefault(
  require("./notification.validation"),
);
const notification_controller_1 = __importDefault(
  require("./notification.controller"),
);
const router = (0, express_1.Router)();
router.post(
  "/",
  (0, auth_1.default)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN]),
  (0, validateRequest_1.default)(
    notification_validation_1.default.CreateNotificationValidation,
  ),
  notification_controller_1.default.createNotification,
);
router.get(
  "/",
  (0, auth_1.default)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN]),
  notification_controller_1.default.getNotifications,
);
router.get(
  "/my",
  (0, auth_1.default)(Object.values(client_1.UserRole)),
  notification_controller_1.default.getMyNotifications,
);
const NotificationRouter = router;
exports.default = NotificationRouter;

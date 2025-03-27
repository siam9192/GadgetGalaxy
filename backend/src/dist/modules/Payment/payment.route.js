"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("./payment.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get("/ispn", payment_controller_1.default.checkPayment);
router.get(
  "/my",
  (0, auth_1.default)([client_1.UserRole.CUSTOMER]),
  payment_controller_1.default.getMyPayments,
);
router.get(
  "/manage",
  // auth([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  payment_controller_1.default.getPayments,
);
const PaymentRouter = router;
exports.default = PaymentRouter;

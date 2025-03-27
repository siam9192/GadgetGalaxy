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
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const Running = () => {
  // Run the handler function every 10 minutes
  setInterval(handler, 1000 * 60 * 10);
  function handler() {
    return __awaiter(this, void 0, void 0, function* () {
      // Set the expiration time to 24 hours ago
      const paymentExpiredAt = new Date();
      paymentExpiredAt.setHours(paymentExpiredAt.getHours() - 24);
      // Update all pending payments that were created more than 24 hours ago (except COD payments) to 'EXPIRED'
      yield prisma_1.default.payment.updateMany({
        where: {
          method: {
            not: client_1.PaymentMethod.COD, // Exclude COD payments
          },
          status: client_1.PaymentStatus.PENDING, // Only update pending payments
          createdAt: {
            lte: paymentExpiredAt, // Payments older than 24 hours
          },
        },
        data: {
          status: client_1.PaymentStatus.EXPIRED, // Mark them as expired
        },
      });
      // Update all pending orders where the payment has expired (excluding COD) to 'FAILED'
      yield prisma_1.default.order.updateMany({
        where: {
          status: client_1.OrderStatus.PENDING, // Only update pending orders
          payment: {
            status: client_1.PaymentStatus.EXPIRED, // Only if payment is expired
            method: {
              not: client_1.PaymentMethod.COD, // Exclude COD payments
            },
          },
        },
        data: {
          status: client_1.OrderStatus.FAILED, // Mark the order as failed
        },
      });
    });
  }
};
const RunningServices = {
  Running,
};
exports.default = RunningServices;

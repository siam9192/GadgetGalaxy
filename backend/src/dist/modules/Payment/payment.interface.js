"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECheckPaymentStatus = void 0;
var ECheckPaymentStatus;
(function (ECheckPaymentStatus) {
  ECheckPaymentStatus["VALID"] = "VALID";
  ECheckPaymentStatus["FAILED"] = "FAILED";
  ECheckPaymentStatus["CANCELLED"] = "CANCELLED";
  ECheckPaymentStatus["UNATTEMPTED"] = "UNATTEMPTED";
  ECheckPaymentStatus["EXPIRED"] = "EXPIRED";
})(
  ECheckPaymentStatus ||
    (exports.ECheckPaymentStatus = ECheckPaymentStatus = {}),
);

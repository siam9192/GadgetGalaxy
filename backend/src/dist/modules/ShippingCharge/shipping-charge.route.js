"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const shipping_charge_validation_1 = __importDefault(require("./shipping-charge.validation"));
const shipping_charge_controller_1 = __importDefault(require("./shipping-charge.controller"));
const router = (0, express_1.Router)();
router.get("");
router.post("/", (0, validateRequest_1.default)(shipping_charge_validation_1.default.CreateShippingChargeValidation), shipping_charge_controller_1.default.createShippingCharge);
router.get("/", shipping_charge_controller_1.default.getShippingCharges);
router.put("/:shippingChargeId", (0, validateRequest_1.default)(shipping_charge_validation_1.default.UpdateShippingChargeValidation));
router.delete("/:id", shipping_charge_controller_1.default.deleteShippingChargeById);
const ShippingChargeRouter = router;
exports.default = ShippingChargeRouter;

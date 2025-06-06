"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const cart_item_validation_1 = __importDefault(require("./cart-item.validation"));
const cart_item_controller_1 = __importDefault(require("./cart-item.controller"));
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)([client_1.UserRole.CUSTOMER]), (0, validateRequest_1.default)(cart_item_validation_1.default.CreateCartItemValidation), cart_item_controller_1.default.createCartItem);
router.patch("/change-quantity", (0, auth_1.default)([client_1.UserRole.CUSTOMER]), (0, validateRequest_1.default)(cart_item_validation_1.default.ChangeItemQuantity), cart_item_controller_1.default.changeItemQuantity);
router.patch("/change-variant", (0, auth_1.default)([client_1.UserRole.CUSTOMER]), (0, validateRequest_1.default)(cart_item_validation_1.default.changeItemVariantValidation), cart_item_controller_1.default.changeItemVariant);
router.get("/", (0, auth_1.default)([client_1.UserRole.CUSTOMER]), cart_item_controller_1.default.getMyCartItems);
router.delete("/:id", (0, auth_1.default)([client_1.UserRole.CUSTOMER]), cart_item_controller_1.default.deleteCartItemFromDB);
const CartItemRouter = router;
exports.default = CartItemRouter;

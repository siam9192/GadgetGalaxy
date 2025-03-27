"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const CreateCartItemValidation = zod_1.z.object({
  productId: zod_1.z.number(),
  variantId: zod_1.z.number().optional(),
  quantity: zod_1.z.number().min(1),
});
const ChangeItemQuantity = zod_1.z.object({
  id: zod_1.z.string(),
  quantity: zod_1.z.number().min(1),
});
const CartItemValidations = {
  CreateCartItemValidation,
  ChangeItemQuantity,
};
exports.default = CartItemValidations;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const shippingInfo = zod_1.z.object({
  fullName: zod_1.z.string(),
  emailAddress: zod_1.z.string().email().optional(),
  phoneNumber: zod_1.z.string().length(11),
  address: zod_1.z
    .object({
      district: zod_1.z.string(),
      zone: zod_1.z.string(),
      line: zod_1.z.string(),
    })
    .optional(),
  addressId: zod_1.z.string().optional(),
});
const InitOrderValidation = zod_1.z.object({
  discountCode: zod_1.z.string().nonempty().optional(),
  shippingChargeId: zod_1.z.number(),
  cartItemsId: zod_1.z.array(zod_1.z.string()).min(1),
  shippingInfo,
  removeCartItemsAfterPurchase: zod_1.z.boolean(),
});
const PlaceOrderValidation = zod_1.z.object({
  discountCode: zod_1.z.string().nonempty().optional(),
  shippingChargeId: zod_1.z.number(),
  cartItemsId: zod_1.z.array(zod_1.z.string()).min(1),
  shippingInfo,
  removeCartItemsAfterPurchase: zod_1.z.boolean(),
});
const UpdateOrderStatusByStaffValidation = zod_1.z.object({
  orderId: zod_1.z.string(),
  status: zod_1.z.enum(Object.values(client_1.OrderStatus)),
});
const OrderValidations = {
  InitOrderValidation,
  UpdateOrderStatusByStaffValidation,
  PlaceOrderValidation,
};
exports.default = OrderValidations;

import { z } from "zod";

const shippingInfo = z.object({
  fullName: z.string(),
  emailAddress: z.string().email().optional(),
  phoneNumber: z.string().length(11),
  address: z
    .object({
      district: z.string(),
      zone: z.string(),
      line: z.string(),
    })
    .optional(),
  addressId: z.string().optional(),
});

const InitOrderValidation = z.object({
  discountCode: z.string().nonempty().optional(),
  shippingChargeId: z.string().nonempty(),
  cartItemsId: z.array(z.string()).min(1),
  shippingInfo,
  removeCartItemsAfterPurchase: z.boolean(),
});

const OrderValidations = {
  InitOrderValidation,
};

export default OrderValidations;

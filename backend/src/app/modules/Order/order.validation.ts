import { z } from "zod";

const OrderItem = z.object({
  productId: z.string().nonempty(),
  quantity: z.number().int().min(1),
});

const shippingAddress = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
});

const CreateOrderValidation = z.object({
  couponId: z.string().nonempty(),
  items: z.array(OrderItem),
  shippingAddress,
});

const OrderValidations = {
  CreateOrderValidation,
};

export default OrderValidations;

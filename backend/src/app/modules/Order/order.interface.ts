import { ShippingAddress } from "@prisma/client";

export interface ICreateOrderPayload {
  couponId?: string;
  items: IOrderItem[];
  shippingAddress: ShippingAddress;
}

interface IOrderItem {
  productId: string;
  quantity: number;
}

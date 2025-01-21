import { OrderStatus } from "@prisma/client";

export interface ICreateOrderPayload {
  discountCode?: string;
  shippingChargeId: string;
  shippingInfo: IShippingInfo;
  notes?: string;
  cartItemsId: string[];
  removeCartItemsAfterPurchase: boolean;
}

interface IShippingInfo {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  address: {
    district: string;
    zone: string;
    line: string;
  };
  addressId?: string;
}

interface IOrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface IUpdateOrderStatusPayload {
  orderId: string;
  status: `${OrderStatus}`;
}

export interface IFilterOrder {
  status: `${OrderStatus}`;
}

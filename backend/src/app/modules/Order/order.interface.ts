import { OrderStatus, PaymentMethod } from "@prisma/client";

export interface ICreateOrderPayload {
  discountCode?: string;
  shippingChargeId: number;
  shippingInfo: IShippingInfo;
  notes?: string;
  cartItemsId: string[];
  paymentMethod: `${PaymentMethod}`;
  removeCartItemsAfterPurchase: boolean;
}

export interface IPlaceOrderPayload {
  discountCode?: string;
  shippingChargeId: number;
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
  orderId: number;
  status: "PROCESSING" | "IN_TRANSIT" | "DELIVERED";
  isNext?: boolean;
}

export interface IMyOrderFilterQuery {
  status?: `${OrderStatus}`;
  customerId?: string;
  orderId?: string;
  orderDate?: string;
  startDate?: string;
  endDate?: string;
}

export interface IMyOrderFilterQuery {
  startDate?: string;
  endDate?: string;
  status?: `${OrderStatus}`;
}

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
  isNext?: boolean;
}

export interface IFilterOrder {
  status?: `${OrderStatus}`;
  customerId?: string;
  orderId?: string;
  orderDate?: string;
  startDate?: string;
  endDate?: string;
}

export interface IFilterMyOrder {
  startDate?: string;
  endDate?: string;
  status?: `${OrderStatus}`;
}

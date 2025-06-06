import { TVariantAttribute } from "./product.type";

export interface IMyOrder {
  id: number;
  shippingInfo:IShippingInfo
  items: IOrderItem[];
  totalAmount: number;
  discountAmount: number;
  grossAmount: number;
  shippingAmount: number;
  netAmount: number;
  notes: string;
  exceptedDeliveryDate: IExceptedDeliveryDate;
  status: TOrderStatus;
  paymentStatus: TOrderPaymentStatus;
  createdAt: string;
  payment: IPayment;

}


interface IShippingInfo {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
    district: string;
    zone: string;
    line: string;
}

export interface IOrderItem {
  id: string;
  orderId: number;
  productId: number;
  variantId: string;
  productName: string;
  imageUrl: string;
  colorName: string;
  colorCode: string;
  attributes:TVariantAttribute[] ;
  quantity: number;
  price: number;
  totalAmount: number;
  isReviewed: boolean;
  
}

export interface IExceptedDeliveryDate {
  to?: string;
  from?: string;
  in?: string;
}

export enum EOrderStatus {
  PENDING = "PENDING",
  PLACED = "PLACED",
  PROCESSING = "PROCESSING",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
}

export enum EOrderPaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export interface IPayment {
  id: string;
  transactionId: string;
  customerId: any;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type TOrderPaymentStatus = `${EOrderPaymentStatus}`;
export type TOrderStatus = `${EOrderStatus}`;

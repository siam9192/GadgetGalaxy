import { PaymentMethod, PaymentStatus } from "@prisma/client";

export interface IInitPaymentPayload {
  method: `${PaymentMethod}`;
  amount: number;
  customer: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  shippingAddress: string;
}

export interface IFilterPayments {
  minAmount?: string;
  maxAmount?: string;
  startDate?: string;
  endDate?: string;
  status?: `${PaymentStatus}`;
  customerId?: string;
}

export enum ECheckPaymentStatus {
  VALID = "VALID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  UNATTEMPTED = "UNATTEMPTED",
  EXPIRED = "EXPIRED",
}

export interface ICheckPaymentQuery {
  status: "VALID";
  tran_date: string;
  val_id: string;
  amount: string;
  store_amount: string;
}

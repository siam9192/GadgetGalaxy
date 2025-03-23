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

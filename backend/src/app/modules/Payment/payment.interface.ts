export interface IInitPaymentPayload {
  orderId: string;
  amount: number;
  customer: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  shippingAddress: string;
}

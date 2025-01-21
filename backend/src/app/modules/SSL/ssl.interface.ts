export interface IInitSSLPaymentPayload {
  transactionId: string;
  amount: number;
  url: {
    success: string;
    cancel: string;
    fail: string;
  };
  customer: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  shippingAddress: string;
}

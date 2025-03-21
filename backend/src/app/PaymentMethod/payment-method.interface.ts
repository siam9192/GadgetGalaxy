export interface IPaymentMethodData {
  transactionId: number;
  currency?: "USD";
  service_name: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
}

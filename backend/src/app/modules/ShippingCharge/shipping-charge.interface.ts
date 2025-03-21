export interface ICreateShippingChargePayload {
  title: string;
  description?: string;
  cost: number;
}

export type IUpdateShippingChargePayload =
  Partial<ICreateShippingChargePayload>;

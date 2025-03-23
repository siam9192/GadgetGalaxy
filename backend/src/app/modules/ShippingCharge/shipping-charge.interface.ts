export interface ICreateShippingChargePayload {
  title: string;
  description?: string;
  cost: number;
  deliveryHours: string;
}

export type IUpdateShippingChargePayload =
  Partial<ICreateShippingChargePayload>;

export interface IShippingChargesFilterQuery {
  searchTerm?: string;
  deliveryHours?: string;
}

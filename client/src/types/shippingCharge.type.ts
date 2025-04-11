export interface IShippingCharge {
  id: number;
  title: string;
  description: string;
  cost: number;
  deliveryHours: string;
  status: TShippingChargeStatus;
  createdAt: string;
  updatedAt: string;
}

export type TShippingChargeStatus = `${EShippingChargeStatus}`;
export enum EShippingChargeStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
}

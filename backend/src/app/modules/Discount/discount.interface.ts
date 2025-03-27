import { DiscountStatus, DiscountType } from "@prisma/client";

export interface ICreateDiscountPayload {
  code: string;
  title: string;
  description: string;
  discountType: `${DiscountType}`;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount?: number;
  validFrom: Date;
  validUntil: Date;
  customersId: number[];
  categoriesId: number[];
  status: `${DiscountStatus}`;
}

export interface IUpdateDiscountPayload {
  code?: string;
  title?: string;
  description?: string;
  discountType?: `${DiscountType}`;
  discountValue?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount?: number;
  validFrom?: Date;
  validUntil?: Date;
  new?: {
    customersId?: number[];
    categoriesId?: number[];
  };
  removed?: {
    customersId?: number[];
    categoriesId?: number[];
  };
  status?: `${DiscountStatus}`;
}

export interface IDiscounTFilterQuery {
  code?: string;
  startDate?: string;
  endDate?: string;
  validFrom?: string;
  validUntil?: string;
  status?: `${DiscountStatus}`;
}

export interface IApplyDiscountPayload {
  cartItemsId: string[];
  code: string;
}

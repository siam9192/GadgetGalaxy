import { DiscountStatus, DiscountType } from "@prisma/client";

export interface ICreateDiscountPayload {
  code: string;
  description: string;
  discountType: `${DiscountType}`;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount?: number;
  validFrom: Date;
  validUntil: Date;
  customersId: string[];
  categoriesId: string[];
  status: `${DiscountStatus}`;
}

export interface IUpdateDiscountPayload {
  code?: string;
  description?: string;
  discountType?: `${DiscountType}`;
  discountValue?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount?: number;
  validFrom?: Date;
  validUntil?: Date;
  newCustomersId?: string[];
  newCategoriesId?: string[];
  removed?:{
    customers?:string[];
    categories?:string[]
  }
  status?: `${DiscountStatus}`;
}


export interface IFilterDiscount {
    code?:string;
    startDate?:string
    endDate?:string
    validFrom?:string
    validUntil?:string
}


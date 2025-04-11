"use server";

import axiosInstance from "@/axios-instance";
import { TApplyDiscountResult } from "@/types/discount.type";
import { IResponse } from "@/types/response.type";

export async function applyDiscount(payload: any) {
  try {
    const res = await axiosInstance.post("/discounts/apply", payload);
    const resData: IResponse<TApplyDiscountResult> = res.data;
    return resData;
  } catch (error: any) {
    return error?.response?.data;
  }
}

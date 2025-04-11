"use server";

import axiosInstance from "@/axios-instance";
import { IResponse } from "@/types/response.type";
import { IShippingCharge } from "@/types/shippingCharge.type";

export async function getShippingCharges() {
  try {
    const res = await axiosInstance.get(`/shipping-charges`);
    const resData: IResponse<IShippingCharge[]> = res.data;
    let result;
    if (resData.success) {
      result = resData;
    }
    return result;
  } catch (error) {
    return null;
  }
}

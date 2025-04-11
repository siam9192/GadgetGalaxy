"use server";

import axiosInstance from "@/axios-instance";
import { IResponse } from "@/types/response.type";
import { IParam } from "@/types/util.type";

export async function orderInit(payload: any) {
  try {
    const res = await axiosInstance.post("/orders/init", payload);
    const resData: IResponse<{ paymentUrl: string }> = res.data;
    return resData;
  } catch (error: any) {
    return error.response.data as IResponse<null>;
  }
}

export async function placeOrder(payload: any) {
  try {
    const res = await axiosInstance.post("/orders/place", payload);
    const resData: IResponse<{ paymentUrl: string }> = res.data;
    return resData;
  } catch (error: any) {
    return error.response.data as IResponse<null>;
  }
}

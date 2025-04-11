"use server";

import axiosInstance from "@/axios-instance";
import { ICategory } from "@/types/category.type";
import { IResponse } from "@/types/response.type";

export async function updateProfile(payload: any) {
  try {
    const res = await axiosInstance.put("/profile", payload);
    const resData: IResponse<null> = res.data;
    return resData;
  } catch (error) {
    return null;
  }
}

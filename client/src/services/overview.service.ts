"use server";

import axiosInstance from "@/axios-instance";
import { TMyOverView } from "@/types/overview.type";
import { IResponse } from "@/types/response.type";

export const getMyOverviewData = async () => {
  try {
    const res = await axiosInstance.get("/overview/my");
    const resData: IResponse<TMyOverView> = res.data;
    if (resData.success) {
      return resData;
    } else throw new Error();
  } catch (error) {
    return null;
  }
};

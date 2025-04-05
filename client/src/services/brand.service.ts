"use server";

import axiosInstance from "@/axios-instance";
import { IResponse } from "@/types/response.type";
import { IParam } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";

export async function getTopBrands() {
  try {
    const res = await axiosInstance.get("/brands/top");
    const resData: IResponse<IBrand[]> = res.data;
    let result;
    if (resData.success) {
      result = resData.data;
    }
    return result;
  } catch (error) {
    return [];
  }
}

export async function getSearchRelatedBrand(params: IParam[]) {
  try {
    const res = await axiosInstance.get(`/brands/search-related?${getParamsToString(params)}`);
    const resData: IResponse<IBrand[]> = res.data;
    let result;
    if (resData.success) {
      result = resData.data;
    }
    return result;
  } catch (error) {
    return [];
  }
}



export async function getCategoryRelatedBrands(slug:string) {
  try {
    const res = await axiosInstance.get(`/brands/category-related/${slug}`);
    const resData: IResponse<IBrand[]> = res.data;
    let result;
    if (resData.success) {
      result = resData.data;
    }
    return result;
  } catch (error) {
    return [];
  }
}
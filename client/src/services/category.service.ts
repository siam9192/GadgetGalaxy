"use server";

import axiosInstance from "@/axios-instance";
import { ICategory } from "@/types/category.type";
import { IResponse } from "@/types/response.type";
import { IParam } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";

export async function getPopularCategories() {
  try {
    const res = await axiosInstance.get("/categories/popular");
    const resData: IResponse<ICategory[]> = res.data;
    let result;
    if (resData.success) {
      result = resData.data;
    }
    return result;
  } catch (error) {
    return [];
  }
}

export async function getAllVisibleCategories() {
  try {
    const res = await axiosInstance.get("/categories/visible");
    const resData: IResponse<ICategory[]> = res.data;
    let result;
    if (resData.success) {
      result = resData.data;
    }
    return result;
  } catch (error) {
    return [];
  }
}

export async function getSearchRelatedCategories(params: IParam[]) {
  try {
    const res = await axiosInstance.get(`/categories/search-related?${getParamsToString(params)}`);
    const resData: IResponse<ICategory[]> = res.data;
    let result;
    if (resData.success) {
      result = resData.data;
    }
    return result;
  } catch (error) {
    return [];
  }
}

export async function getCategories(params: IParam[]) {
  try {
    const res = await axiosInstance.get(`/categories${getParamsToString(params)}`);
    const resData: IResponse<ICategory[]> = res.data;
    let result;
    if (resData.success) {
      result = resData;
    }
    return result;
  } catch (error) {
    return null;
  }
}

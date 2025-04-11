"use server";

import axiosInstance from "@/axios-instance";
import { IProduct, TCardProduct, TVariant } from "@/types/product.type";
import { IResponse } from "@/types/response.type";
import { IParam } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";

export const getFeaturedProducts = async () => {
  try {
    const res = await axiosInstance.get("/products/featured");
    const resData: IResponse<TCardProduct[]> = res.data;
    let result: TCardProduct[] = [];
    if (resData.success) {
      result = resData.data;
    }
    return result;
  } catch (error) {
    return [];
  }
};

export async function getTopBrandsProducts(id: number) {
  try {
    const res = await axiosInstance.get(`/products/top-brand/${id}`);
    const resData: IResponse<TCardProduct[]> = res.data;
    let result: TCardProduct[] = [];
    if (resData.success) {
      result = resData.data;
    }
    return result;
  } catch (error) {
    return [];
  }
}

export const getNewArrivalProducts = async () => {
  try {
    const res = await axiosInstance.get("/products/new-arrival");
    const resData: IResponse<TCardProduct[]> = res.data;
    let result: TCardProduct[] = [];
    if (resData.success) {
      result = resData.data;
    }
    return result;
  } catch (error) {
    return [];
  }
};

export async function getSearchProducts(params: IParam[]) {
  try {
    const res = await axiosInstance.get(`/products/search${getParamsToString(params)}`);
    const resData: IResponse<TCardProduct[]> = res.data;
    if (resData.success) {
      return resData;
    } else {
      throw new Error();
    }
  } catch (error) {
    return null;
  }
}

export async function getCategoryProducts(slug: string, params: IParam[]) {
  try {
    const res = await axiosInstance.get(`/products/category/${slug}${getParamsToString(params)}`);
    const resData: IResponse<TCardProduct[]> = res.data;
    if (resData.success) {
      return resData;
    } else {
      throw new Error();
    }
  } catch (error) {
    return null;
  }
}

export async function getBrandProducts(name: string, params: IParam[]) {
  try {
    const res = await axiosInstance.get(`/products/brand/${name}${getParamsToString(params)}`);
    const resData: IResponse<TCardProduct[]> = res.data;
    if (resData.success) {
      return resData;
    } else {
      throw new Error();
    }
  } catch (error) {
    return null;
  }
}

export async function getProductDetails(slug: string) {
  try {
    const res = await axiosInstance.get(`/products/details/${slug}`);
    const resData: IResponse<IProduct> = res.data;
    if (resData.success) {
      return resData;
    } else {
      throw new Error();
    }
  } catch (error) {
    return null;
  }
}

export async function getRelatedProducts(slug: string) {
  try {
    const res = await axiosInstance.get(`/products/related/${slug}`);
    const resData: IResponse<TCardProduct[]> = res.data;
    if (resData.success) {
      return resData;
    } else {
      throw new Error();
    }
  } catch (error) {
    return null;
  }
}

export async function getRecentViewedProducts(ids: string) {
  try {
    const res = await axiosInstance.get(`/products/recently-viewed/${ids}`);
    const resData: IResponse<TCardProduct[]> = res.data;
    if (resData.success) {
      return resData;
    } else {
      throw new Error();
    }
  } catch (error) {
    return null;
  }
}

export async function getProductVariants(id: number) {
  try {
    const res = await axiosInstance.get(`/products/${id}/variants`);
    const resData: IResponse<TVariant[]> = res.data;
    if (resData.success) {
      return resData;
    } else {
      throw new Error();
    }
  } catch (error) {
    return null;
  }
}

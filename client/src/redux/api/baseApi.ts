import envConfig from "@/config/envConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl:envConfig.base_api,
    // credentials:"include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({}),
  tagTypes: [
    "cart-items",
    "wishlist-items",
    "utils-count",
    "my-orders",
    "my-not-reviewed",
    "my-product-reviews",
    "product-reviews",
  ],
});

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API,
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
    "my-blogs",
    "blog-comments",
    "blog-comments-replies",
    "users",
    "following-authors",
    "categories",
  ],
});

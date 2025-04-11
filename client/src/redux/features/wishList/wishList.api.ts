import { baseApi } from "@/redux/api/baseApi";
import { TCardProduct } from "@/types/product.type";
import { IResponse } from "@/types/response.type";
import { IParam } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";
const wishListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addToWishList: builder.mutation({
      query: (payload: any) => ({
        url: `/wishlist-items`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: IResponse<null>) => {
        return response;
      },
      invalidatesTags: ["utils-count", "wishlist-items"],
    }),
    removeFromWishList: builder.mutation({
      query: (productId: number) => ({
        url: `/wishlist-items/${productId}`,
        method: "DELETE",
      }),
      transformResponse: (response: IResponse<null>) => {
        return response;
      },
      invalidatesTags: ["utils-count", "wishlist-items"],
    }),
    getMyWishList: builder.query({
      query: (params: IParam[]) => ({
        url: `/wishlist-items/my${getParamsToString(params)}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<TCardProduct[]>) => {
        return response;
      },
      providesTags: ["wishlist-items"],
    }),
  }),
});

export const { useAddToWishListMutation, useRemoveFromWishListMutation, useGetMyWishListQuery } =
  wishListApi;

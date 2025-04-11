import { baseApi } from "@/redux/api/baseApi";
import { ICartItem } from "@/types/cartItem.type";
import { IResponse } from "@/types/response.type";
const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (payload: any) => ({
        url: `/cart-items`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: IResponse<null>) => {
        return response;
      },
      invalidatesTags: ["cart-items", "utils-count"],
    }),
    getMyCartItems: builder.query({
      query: () => ({
        url: `/cart-items`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<ICartItem[]>) => {
        return response;
      },
      providesTags: ["cart-items"],
    }),
    removeCartItem: builder.mutation({
      query: (id: string) => ({
        url: `/cart-items/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: IResponse<null>) => {
        return response;
      },
      invalidatesTags: ["cart-items", "utils-count"],
    }),
    changeCartVariant: builder.mutation({
      query: (payload: any) => ({
        url: `/cart-items/change-variant`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response: IResponse<null>) => {
        return response;
      },
      invalidatesTags: ["cart-items"],
    }),
    updateCartItemQuantity: builder.mutation({
      query: (payload: any) => ({
        url: `/cart-items/change-quantity`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response: IResponse<null>) => {
        return response;
      },
      invalidatesTags: ["cart-items"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetMyCartItemsQuery,
  useRemoveCartItemMutation,
  useChangeCartVariantMutation,
  useUpdateCartItemQuantityMutation,
} = cartApi;

import { baseApi } from "@/redux/api/baseApi";
import { IMyNotReviewedItem, IProductReview } from "@/types/product-review.type";
import { IResponse } from "@/types/response.type";
import { IParam, TMyUtilsCount } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";

const productReview = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotReviewedItems: builder.query({
      query: (params: IParam[]) => ({
        url: `/product-reviews/my/not-reviewed${getParamsToString(params)}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<IMyNotReviewedItem[]>) => {
        return response;
      },
      providesTags: ["my-not-reviewed"],
    }),
    createProductReview: builder.mutation({
      query: (payload) => ({
        url: `/product-reviews`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: IResponse<null>) => {
        return response;
      },

      invalidatesTags: ["my-not-reviewed"],
    }),
    updateProductReview: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/product-reviews/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: IResponse<null>) => {
        return response;
      },
      invalidatesTags: ["my-product-reviews"],
    }),
    getMyProductReviews: builder.query({
      query: (params: IParam[]) => ({
        url: `/product-reviews/my?${getParamsToString(params)}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<IProductReview[]>) => {
        return response;
      },

      providesTags: ["my-product-reviews"],
    }),
    getProductReviews: builder.query({
      query: ({ params, id }: { id: number; params: IParam[] }) => ({
        url: `/product-reviews/product/${id}/?${getParamsToString(params)}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<IProductReview[]>) => {
        return response;
      },

      providesTags: ["product-reviews"],
    }),
  }),
});

export const {
  useGetMyNotReviewedItemsQuery,
  useCreateProductReviewMutation,
  useGetMyProductReviewsQuery,
  useUpdateProductReviewMutation,
  useGetProductReviewsQuery,
} = productReview;

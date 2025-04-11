import { baseApi } from "@/redux/api/baseApi";
import { IMyOrder } from "@/types/order.type";
import { IResponse } from "@/types/response.type";
import { IParam, TMyUtilsCount } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: (params: IParam[]) => ({
        url: `/orders/my${getParamsToString(params)}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<IMyOrder[]>) => {
        return response;
      },
      providesTags: ["my-orders"],
    }),

    cancelOrder: builder.mutation({
      query: (id: number) => ({
        url: `/orders/cancel/${id}`,
        method: "PATCH",
      }),
      transformResponse: (response: IResponse<null>) => {
        return response;
      },
      invalidatesTags: ["my-orders"],
    }),
  }),
});

export const { useGetMyOrdersQuery, useCancelOrderMutation } = orderApi;

import { baseApi } from "@/redux/api/baseApi";
import { IProduct } from "@/types/product.type";
import { IResponse } from "@/types/response.type";
import { IParam } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchProducts: builder.query({
      query: (params: IParam[]) => ({
        url: `/products/search${getParamsToString(params)}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<IProduct[]>) => {
        return response;
      },
      providesTags:['search-products']
    }),
  }),
});

export const {
 useGetSearchProductsQuery
} = productApi;

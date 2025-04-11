import { baseApi } from "@/redux/api/baseApi";
import { IResponse } from "@/types/response.type";
import { IParam } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchRelatedBrands: builder.query({
      query: (params: IParam[]) => ({
        url: `/brands/search-related?${getParamsToString(params)}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<IBrand[]>) => {
        return response;
      },
    }),
    getCategoryRelatedBrands: builder.query({
      query: (slug: string) => ({
        url: `/brands/category-related/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<IBrand[]>) => {
        return response;
      },
    }),
  }),
});

export const { useGetSearchRelatedBrandsQuery, useGetCategoryRelatedBrandsQuery } = brandApi;

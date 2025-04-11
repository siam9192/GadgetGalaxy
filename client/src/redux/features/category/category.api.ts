import { baseApi } from "@/redux/api/baseApi";
import { ICategory } from "@/types/category.type";
import { IResponse } from "@/types/response.type";
import { IParam } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchRelatedCategories: builder.query({
      query: (params: IParam[]) => ({
        url: `/categories/search-related?${getParamsToString(params)}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<ICategory[]>) => {
        return response;
      },
    }),
    getBrandRelatedCategories: builder.query({
      query: (name: string) => ({
        url: `/categories/brand-related/${name}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<ICategory[]>) => {
        return response;
      },
    }),
    getSubCategories: builder.query({
      query: (slug: string) => ({
        url: `/categories/${slug}/subcategories`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<ICategory[]>) => {
        return response;
      },
    }),
  }),
});

export const {
  useGetSearchRelatedCategoriesQuery,
  useGetSubCategoriesQuery,
  useGetBrandRelatedCategoriesQuery,
} = categoryApi;

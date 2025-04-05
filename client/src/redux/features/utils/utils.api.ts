import { baseApi } from "@/redux/api/baseApi";
import { ICategory } from "@/types/category.type";
import { IResponse } from "@/types/response.type";
import { IParam, TSearchKeywordData } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";

const utilsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchKeywordResults: builder.query({
      query: (keyword:string) => ({
        url: `/utils/search-keyword/${keyword}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<TSearchKeywordData[]>) => {
        return response;
      },
    }),
  }),
});

export const { useGetSearchKeywordResultsQuery } = utilsApi;

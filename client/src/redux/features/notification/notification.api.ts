import { INotification } from "@/types/notification.type";

import { baseApi } from "@/redux/api/baseApi";
import { IResponse } from "@/types/response.type";
import { IParam } from "@/types/util.type";
import { getParamsToString } from "@/utils/helpers";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: (params: IParam[]) => ({
        url: `/notifications/my${getParamsToString(params)}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<INotification[]>) => {
        return response;
      },
    }),
    setAsReadMyAllNotifications: builder.mutation({
      query: () => ({
        url: `/notifications/read`,
        method: "PATCH",
      }),
      transformResponse: (response: IResponse<INotification[]>) => {
        return response;
      },
      invalidatesTags: ["utils-count"],
    }),
  }),
});

export const { useGetMyNotificationsQuery, useSetAsReadMyAllNotificationsMutation } =
  notificationApi;

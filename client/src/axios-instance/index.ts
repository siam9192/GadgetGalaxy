import envConfig from "@/config/envConfig";
import { getNewAccessToken } from "@/services/auth.service";
import axios from "axios";
import { cookies } from "next/headers";

const axiosInstance = axios.create({
  baseURL: envConfig.base_api,
});

axiosInstance.interceptors.request.use(async function (config) {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const config = error.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;
      const res = await getNewAccessToken();
      const accessToken = res?.data?.accessToken;
      if (!accessToken) {
        Promise.reject(error);
      }
      config.headers["Authorization"] = accessToken;
      (await cookies()).set("accessToken", accessToken);
      return axiosInstance(config);
    } else {
      return Promise.reject(error);
    }
  },
);

export default axiosInstance;

"use server";

import axiosInstance from "@/axios-instance";
import { TMe } from "@/types/auth.type";

import { IResponse } from "@/types/response.type";
import { IUser } from "@/types/user.type";
import { cookies } from "next/headers";

interface ISignupPayload {
  email: string;
  password: string;
  fullName: string;
}

interface ISigninPayload {
  email: string;
  password: string;
}

export const signup = async (payload: ISignupPayload) => {
  try {
    const { data: resData } = await axiosInstance.post("/auth/register", payload);
    return resData as IResponse<{ email: string; token: string }>;
  } catch (error: any) {
    return error?.response?.data as IResponse<null>;
  }
};

export const verifySignupRequest = async (payload: any) => {
  try {
    const { data: resData } = await axiosInstance.post("/auth/register/verify", payload);
    return resData as IResponse<{ email: string; token: string }>;
  } catch (error: any) {
    return error?.response?.data as IResponse<null>;
  }
};

export const resendOtp = async (token: string) => {
  try {
    const { data: resData } = await axiosInstance.post(`/auth/resend-otp/${token}`);
    return resData as IResponse<{ email: string; token: string }>;
  } catch (error: any) {
    return error?.response?.data as IResponse<null>;
  }
};

export const login = async (payload: ISigninPayload) => {
  try {
    const { data: resData } = await axiosInstance.post("/auth/login", payload);
    if (resData.success) {
      (await cookies()).set("accessToken", resData.data.accessToken, {
        maxAge: 30 * 24 * 60 * 60,
      });
      (await cookies()).set("refreshToken", resData.data.refreshToken, {
        maxAge: 60 * 24 * 60 * 60,
      });
    }
    return resData as IResponse<null>;
  } catch (error: any) {
    return error?.response?.data as IResponse<null>;
  }
};

export const googleCallBack = async (accessToken: string) => {
  try {
    const { data: resData } = await axiosInstance.post("/auth/google-callback", { accessToken });
    if (resData.success) {
      (await cookies()).set("accessToken", resData.data.accessToken, {
        maxAge: 30 * 24 * 60 * 60,
      });
      (await cookies()).set("refreshToken", resData.data.refreshToken, {
        maxAge: 60 * 24 * 60 * 60,
      });
    }
    return resData as IResponse<null>;
  } catch (error: any) {
    return error?.response?.data as IResponse<null>;
  }
};

export const forgetPassword = async (emailAddress: string) => {
  try {
    const { data: resData } = await axiosInstance.post(`/auth/forget-password/${emailAddress}`);
    return resData as IResponse<null>;
  } catch (error: any) {
    return error?.response?.data as IResponse<null>;
  }
};
export const resetPassword = async (payload: any) => {
  try {
    const { data: resData } = await axiosInstance.post(`/auth/reset-password/`, payload);
    return resData as IResponse<null>;
  } catch (error: any) {
    return error?.response?.data as IResponse<null>;
  }
};

export const logout = async () => {
  try {
    (await cookies()).delete("accessToken");
    (await cookies()).delete("refreshToken");
    return true;
  } catch (error) {
    return false;
  }
};

export const changePassword = async (payload: { oldPassword: string; newPassword: string }) => {
  try {
    const { data } = await axiosInstance.patch("/auth/change-password", payload);
    return data as IResponse<null>;
  } catch (error: any) {
    throw new Error();
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await axiosInstance.get("/auth/me");

    return data.data as TMe;
  } catch (error) {
    return null;
  }
};

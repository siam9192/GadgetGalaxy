"use server";

import { cookies } from "next/headers";

export const setCheckoutData = async (data: any) => {
  try {
    (await cookies()).set("accessToken", JSON.stringify(data));
  } catch (error: any) {}
};

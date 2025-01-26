import { Browser, UserRole } from "@prisma/client";
import { IName } from "../../reuse/types";

export interface ISignUpData {
  name: IName;
  email: string;
  password: string;
  role: "Customer" | "Vendor";
}

export interface IRegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
  browser: `${Browser}`;
  ipAddress?: string;
}

export interface IVerifyAccountData {
  token: string;
  otp: string;
}

export interface IOtpPayload {
  email: string;
  verificationId: string;
}

export interface IAuthUser {
  id: string;
  role: `${UserRole}`;
  customerId?: string;
  staffId?: string;
  activityId: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}


export interface IResetPasswordPayload {
  token:string,
  newPassword:string
}
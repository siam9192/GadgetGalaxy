import { IName } from "../../reuse/types";
import { TRole } from "../User/user.interface";

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
  requestId: string;
}

export interface IAuthUser {
  id: number;
  role: TRole;
  administratorId?: number;
  customerId?: number;
  activityId?: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface IResetPasswordPayload {
  token: string;
  newPassword: string;
}

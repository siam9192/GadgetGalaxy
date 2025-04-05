import { TAuthProvider, TCustomerAddress, TGender, TUserRole, TUserStatus } from "./user.type";

export type TMe = {
  email: string;
  authProvider: TAuthProvider;
  fullName: string;
  profilePhoto: string;
  phoneNumber: string;
  gender: TGender;
  addresses: TCustomerAddress;
  role: TUserRole;
  status: TUserStatus;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
};

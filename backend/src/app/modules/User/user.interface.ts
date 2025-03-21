import { AuthProvider, UserGender, UserRole, UserStatus } from "@prisma/client";
import { IName } from "../../reuse/types";

export interface ICustomerFilterRequest {
  searchTerm?: string;
  id?: string;
  status?: string;
}

export interface IUserFilterRequest {
  id: string;
  provider: AuthProvider;
  status: UserStatus;
}

export interface ICreateStaffPayload {
  fullName: string;
  email: string;
  password: string;
  profilePhoto: string;
  gender?: `${UserGender}`;
}

export type TRole = `${UserRole}`;

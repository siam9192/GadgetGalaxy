import { AuthProvider, UserGender, UserRole, UserStatus } from "@prisma/client";
import { IName } from "../../reuse/types";

export interface ICustomerFilterQuery {
  searchTerm?: string;
  status?: `${UserStatus}`;
}

export interface IAdministratorFilterQuery {
  searchTerm?: string;
  status?: `${UserStatus}`;
  role?: "SUPER_ADMIN" | "ADMIN" | "MODERATOR";
}

export interface IUserFilterRequest {
  id: string;
  provider: AuthProvider;
  status: UserStatus;
}

export interface ICreateAdministratorPayload {
  fullName: string;
  email: string;
  password: string;
  profilePhoto: string;
  phoneNumber: string;
  gender?: `${UserGender}`;
  role: "ADMIN" | "MODERATOR";
}

export type TRole = `${UserRole}`;

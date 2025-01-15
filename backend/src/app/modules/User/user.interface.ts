import { AccountStatus, AuthProvider } from "@prisma/client";
import { IName } from "../../reuse/types";

export interface ICustomerFilterRequest {
  searchTerm?: string;
  id?: string;
  status?: string;
}

export interface IUserFilterRequest {
  id: string;
  provider: AuthProvider;
  status: AccountStatus;
}

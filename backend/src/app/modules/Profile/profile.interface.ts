import { UserGender } from "@prisma/client";

export interface IUpdateCustomerProfilePayload {
  fullName?: string;
  profilePhoto?: string;
  phoneNumber?: string;
  gender?: `${UserGender}`;
  dateOfBirth?: string | Date;
  addresses?: {
    id: string;
    district: string;
    zone: string;
    line: string;
    isDefault: boolean;
    isDeleted?: boolean;
  }[];
}

export interface IUpdateAdministratorProfilePayload {
  fullName?: string;
  profilePhoto?: string;
  gender?: `${UserGender}`;
  phoneNumber?: string;
}

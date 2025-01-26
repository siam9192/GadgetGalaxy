import { UserGender } from "@prisma/client";

export interface IUpdateCustomerProfilePayload {
  fullName?: string;
  profilePhoto?: string;
  phoneNumber?: string;
  gender?: `${UserGender}`;
  dateOfBirth?: string;
  updatedAddresses?: {
    id: string;
    district?: string;
    zone?: string;
    line?: string;
    isDefault?: boolean;
  }[];
  newAddedAddresses?: {
    district: string;
    zone: string;
    line: string;
    isDefault: boolean;
  }[];
  deletedAddressesIds?: string[];
}

export interface IUpdateStaffProfilePayload {
  fullName?: string;
  profilePhoto?: string;
  gender?: `${UserGender}`;
}

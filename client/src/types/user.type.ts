export interface IUser {
  id: number;
  role: EUserRole;
  email: string;
  password: string;
  googleId: string;
  facebookId: string;
  authProvider: TAuthProvider;
  customer?: ICustomer;
  administrator?: IAdministrator;
  status: TUserStatus;
  lastLoginAt: string;
  passwordLastChangedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomer {
  id: number;
  userId: number;
  user: IUser;
  fullName: string;
  profilePhoto?: string;
  phoneNumber?: string;
  gender: string;
  dateOfBirth: string;
  addresses?: TCustomerAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface IAdministrator {
  id: number;
  userId: number;
  user: IUser;
  fullName: string;
  profilePhoto?: string;
  phoneNumber?: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

export type TCustomerAddress = {
  id: string;
  district: string;
  zone: string;
  line: string;
  isDefault: boolean;
  isDeleted?: boolean;
};

export type TUserRole = `${EUserRole}`;
export type TUserStatus = `${EUserStatus}`;
export type TAuthProvider = `${EAuthProvider}`;
export type TGender = `${EGender}`;

export enum EUserRole {
  CUSTOMER = "CUSTOMER",
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export enum EGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum EAuthProvider {
  EMAIL_PASSWORD = "EMAIL_PASSWORD",
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
}

export enum EUserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

import { AccountStatus, AuthProvider, Prisma, UserRole } from "@prisma/client";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import {
  ICreateStaffPayload,
  ICustomerFilterRequest,
  IUserFilterRequest,
} from "./user.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IAuthUser } from "../Auth/auth.interface";
import { bcryptHash } from "../../utils/bycrypt";

const ChangeUserStatusIntoDB = async (
  authUser: IAuthUser,
  payload: {
    userId: string;
    status: `${AccountStatus}`;
  },
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
      status: {
        not: "Deleted",
      },
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  await prisma.$transaction(async (txClient) => {
    await txClient.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        status: payload.status,
      },
    });
    await txClient.activityLog.create({
      data: {
        staffId: authUser.staffId!,
        action: `Changed user status ${user.status} to  ${payload.status} id:${payload.userId}`,
      },
    });
  });
};

const getCustomersFromDB = async (
  query: ICustomerFilterRequest,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, id, ...filterData } = query;
  const { limit, skip, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);
  const andConditions: Prisma.CustomerWhereInput[] = [];

  if (filterData && Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  if (searchTerm) {
    const searchableFields = ["fullName", "id"];
    andConditions.push({
      OR: [
        ...searchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
        {
          user: {
            account: {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.CustomerWhereInput = {
    AND: andConditions,
  };

  const customers = await prisma.customer.findMany({
    where: whereConditions,
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
    take: limit,
    skip: skip,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });
  const total = await prisma.customer.count({
    where: whereConditions,
  });
  const meta = {
    total,
    page,
    limit,
    skip,
  };
  return {
    data: customers,
    meta,
  };
};

const getStaffsFromDB = async (
  query: ICustomerFilterRequest,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, id, ...filterData } = query;
  const { limit, skip, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);
  const andConditions: Prisma.StaffWhereInput[] = [];

  if (filterData && Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  if (searchTerm) {
    const searchableFields = ["fullName", "id"];
    andConditions.push({
      OR: [
        ...searchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
        {
          user: {
            account: {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.StaffWhereInput = {
    AND: andConditions,
  };

  const staffs = await prisma.staff.findMany({
    where: whereConditions,
    take: limit,
    skip: skip,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });
  const total = await prisma.staff.count({
    where: whereConditions,
  });
  const meta = {
    total,
    page,
    limit,
    skip,
  };
  return {
    data: staffs,
    meta,
  };
};

const getUsersFromDB = async (
  query: IUserFilterRequest,
  paginationOptions: IPaginationOptions,
) => {
  // const {} = calculatePagination()
};

const softDeleteUserByIdIntoDB = async (authUser: IAuthUser, id: string) => {
  // Check user existence
  const user = await prisma.user.findUnique({
    where: {
      id,
      status: {
        not: "Deleted",
      },
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.$transaction(async (txClient) => {
    await txClient.user.update({
      where: {
        id,
      },
      data: {
        status: "Deleted",
      },
    });

    await txClient.activityLog.create({
      data: {
        staffId: authUser.staffId!,
        action: `Deleted user id:${id}`,
      },
    });
  });

  return null;
};

const createStaffIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateStaffPayload,
) => {
  const user = await prisma.user.findFirst({
    where: {
      account: {
        email: payload.email,
      },
    },
  });
  if (user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User is already exist using this email",
    );
  }
  const result = await prisma.$transaction(async (txClient) => {
    // Create user
    const createdUser = await txClient.user.create({
      data: {
        role: UserRole.Admin,
      },
    });

    const hashedPassword = await bcryptHash(payload.password);

    // Create user account
    await txClient.account.create({
      data: {
        userId: createdUser.id,
        email: payload.email,
        password: hashedPassword,
        authProvider: AuthProvider.EmailPassword,
      },
    });

    // Create staff
    const createdStaff = await txClient.staff.create({
      data: {
        userId: createdUser.id,
        fullName: payload.fullName,
        profilePhoto: payload.profilePhoto,
        gender: payload.gender || null,
      },
    });

    await txClient.activityLog.create({
      data: {
        staffId: authUser.staffId!,
        action: `Created new staff id:${createdStaff.id}`,
      },
    });

    return createdStaff;
  });
  return result;
};

const UserServices = {
  ChangeUserStatusIntoDB,
  getCustomersFromDB,
  getStaffsFromDB,
  softDeleteUserByIdIntoDB,
  createStaffIntoDB,
};

export default UserServices;

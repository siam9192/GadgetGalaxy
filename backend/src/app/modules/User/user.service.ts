import { AccountStatus, Prisma, UserRole } from "@prisma/client";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { ICustomerFilterRequest, IUserFilterRequest } from "./user.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";

const ChangeUserAccountStatusIntoDB = async (data: {
  userId: string;
  status: `${AccountStatus}`;
}) => {
  const account = await prisma.account.findUnique({
    where: {
      userId: data.userId,
      status: {
        not: "Deleted",
      },
    },
  });

  if (!account) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return await prisma.account.update({
    where: {
      userId: data.userId,
    },
    data: {
      status: data.status,
    },
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

const softDeleteUserIntoDB = async (userId: string) => {
  // Check user existence
  const account = await prisma.account.findUnique({
    where: {
      userId: userId,
      status: {
        not: "Deleted",
      },
    },
  });

  if (!account) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Delete user

  await prisma.account.update({
    where: {
      userId: userId,
    },
    data: {
      status: "Deleted",
    },
  });

  return null;
};

const UserServices = {
  ChangeUserAccountStatusIntoDB,
  getCustomersFromDB,
  getStaffsFromDB,
  softDeleteUserIntoDB,
};

export default UserServices;

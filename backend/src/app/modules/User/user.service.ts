import {
  AuthProvider,
  OrderStatus,
  Prisma,
  UserRole,
  UserStatus,
} from "@prisma/client";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import {
  IAdministratorFilterQuery,
  ICreateAdministratorPayload,
  ICustomerFilterQuery,
} from "./user.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IAuthUser } from "../Auth/auth.interface";
import { bcryptHash } from "../../utils/bycrypt";

const ChangeUserStatusIntoDB = async (
  authUser: IAuthUser,
  payload: {
    userId: number;
    status: `${UserStatus}`;
  },
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
      status: {
        not: UserStatus.DELETED,
      },
    },
  });

  // Checking user existence
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
    await txClient.administratorActivityLog.create({
      data: {
        administratorId: authUser.administratorId!,
        action: `User status updated from ${user.status} to ${payload.status} (User ID: ${payload.userId}).`,
      },
    });
  });
};

const getCustomersFromDB = async (
  filterQuery: ICustomerFilterQuery,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, status } = filterQuery;
  const { limit, skip, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);
  const andConditions: Prisma.CustomerWhereInput[] = [];

  // If search term exist then search data by search term
  if (searchTerm && !Number.isNaN(searchTerm)) {
    andConditions.push({
      id: Number(searchTerm),
    });
  } else {
    if (searchTerm) {
      andConditions.push({
        OR: [
          {
            fullName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            user: {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        ],
      });
    }
  }

  const whereConditions: Prisma.CustomerWhereInput = {
    AND: andConditions,
    user: {
      role: UserRole.CUSTOMER,
      status: {
        not: UserStatus.DELETED,
      },
    },
  };

  const customers = await prisma.customer.findMany({
    where: whereConditions,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          authProvider: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      _count: {
        select: {
          orders: {
            where: {
              status: OrderStatus.DELIVERED,
            },
          },
          productReviews: true,
        },
      },
    },
    take: limit,
    skip: skip,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const totalResult = await prisma.customer.count({
    where: whereConditions,
  });
  const total = await prisma.customer.count({
    where: {
      user: {
        status: UserStatus.DELETED,
      },
    },
  });

  const data = customers.map((customer) => {
    const { user } = customer;
    return {
      id: customer.id,
      fullName: customer.fullName,
      email: user.email,
      profilePhoto: customer.profilePhoto,
      phoneNumber: customer.phoneNumber,
      gender: customer.gender,
      authProvider: user.authProvider,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updated: customer.updatedAt,
      count: customer._count,
    };
  });

  const meta = {
    page,
    limit,
    skip,
    totalResult,
    total,
  };
  return {
    data,
    meta,
  };
};

const getAdministratorsFromDB = async (
  filterQuery: IAdministratorFilterQuery,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, status, role } = filterQuery;
  const { limit, skip, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);
  const andConditions: Prisma.AdministratorWhereInput[] = [];

  // If search term exist then search data by search term
  if (searchTerm && !Number.isNaN(searchTerm)) {
    andConditions.push({
      id: Number(searchTerm),
    });
  } else {
    if (searchTerm) {
      andConditions.push({
        OR: [
          {
            fullName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            user: {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        ],
      });
    }
  }

  if (role) {
    andConditions.push({
      user: {
        role,
      },
    });
  }

  if (status) {
    andConditions.push({
      user: {
        role,
      },
    });
  }

  const whereConditions: Prisma.AdministratorWhereInput = {
    AND: andConditions,
    user: {
      role: UserRole.CUSTOMER,
      status: {
        not: UserStatus.DELETED,
      },
    },
  };

  const administrators = await prisma.administrator.findMany({
    where: whereConditions,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          authProvider: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    take: limit,
    skip: skip,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const totalResult = await prisma.administrator.count({
    where: whereConditions,
  });
  const total = await prisma.administrator.count({
    where: {
      user: {
        status: UserStatus.DELETED,
      },
    },
  });

  const data = administrators.map((administrator) => {
    const { user } = administrator;
    return {
      id: administrator.id,
      fullName: administrator.fullName,
      email: user.email,
      profilePhoto: administrator.profilePhoto,
      phoneNumber: administrator.phoneNumber,
      gender: administrator.gender,
      authProvider: user.authProvider,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updated: administrator.updatedAt,
    };
  });

  const meta = {
    page,
    limit,
    skip,
    totalResult,
    total,
  };
  return {
    data,
    meta,
  };
};

const softDeleteUserByIdIntoDB = async (
  authUser: IAuthUser,
  id: string | number,
) => {
  id = Number(id);
  // Check user existence
  const user = await prisma.user.findUnique({
    where: {
      id,
      status: {
        not: UserStatus.DELETED,
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
        status: UserStatus.DELETED,
      },
    });

    await txClient.administratorActivityLog.create({
      data: {
        administratorId: authUser.administratorId!,
        action: `User (ID: ${id}) has been deleted.`,
      },
    });
  });

  return null;
};

const createAdministratorIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateAdministratorPayload,
) => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  // Checking user existence
  if (user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User is already exist using this email",
    );
  }
  const result = await prisma.$transaction(async (txClient) => {
    const hashedPassword = await bcryptHash(payload.password);

    // Create user
    const createdUser = await txClient.user.create({
      data: {
        email: payload.email,
        role: payload.role,
        password: hashedPassword,
        authProvider: AuthProvider.EMAIL_PASSWORD,
      },
    });

    // Create staff
    const createAdministrator = await txClient.administrator.create({
      data: {
        userId: createdUser.id,
        fullName: payload.fullName,
        profilePhoto: payload.profilePhoto,
        gender: payload.gender || null,
        phoneNumber: payload.phoneNumber || null,
      },
    });

    await txClient.administratorActivityLog.create({
      data: {
        administratorId: authUser.administratorId!,
        action: `New administrator (ID: ${createAdministrator.id}) has been created.`,
      },
    });

    return createAdministrator;
  });
  return result;
};

const UserServices = {
  ChangeUserStatusIntoDB,
  getCustomersFromDB,
  getAdministratorsFromDB,
  softDeleteUserByIdIntoDB,
  createAdministratorIntoDB,
};

export default UserServices;

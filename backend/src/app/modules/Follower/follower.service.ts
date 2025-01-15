import { Follower, Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import { IAuthUser } from "../Auth/auth.interface";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";

const createFollowerIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateFollowerPayload,
) => {
  const shop = await prisma.shop.findUnique({
    where: {
      id: payload.shopId,
    },
  });

  const customer = await prisma.customer.findUnique({
    where: {
      userId: authUser.id,
    },
    select: {
      id: true,
    },
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const follower = await prisma.follower.findFirst({
    where: {
      customer: {
        userId: authUser.id,
      },
      shopId: payload.shopId,
    },
  });

  if (follower) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Already following");
  }

  const result = await prisma.follower.create({
    data: {
      shopId: payload.shopId,
      customerId: customer.id,
    },
  });

  return result;
};

const deleteFollowerFromDB = async (authUser: IAuthUser, shopId: string) => {
  const whereInput: Prisma.FollowerWhereInput = {
    shopId,
    customer: {
      userId: authUser.id,
    },
  };

  const follower = await prisma.follower.findFirst({
    where: whereInput,
  });

  if (!follower) {
    throw new AppError(httpStatus.NOT_FOUND, "Follower not  found");
  }

  await prisma.follower.deleteMany({
    where: whereInput,
  });
  return null;
};

const getMyShopFollowersFromDB = async (
  authUser: IAuthUser,
  options: IPaginationOptions,
) => {
  const shop = await prisma.shop.findFirst({
    where: {
      vendor: {
        userId: authUser.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const { limit, skip, page } = calculatePagination(options);

  const whereConditions: Prisma.FollowerWhereInput = {
    shopId: shop.id,
  };

  const data = await prisma.follower.findMany({
    where: whereConditions,
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
    },
    take: limit,
    skip,
  });

  const total = await prisma.follower.count({ where: whereConditions });

  const filteredData = data.map((item) => ({
    follower: item.customer,
    createdAt: item.createdAt,
  }));

  return {
    data: filteredData,
    meta: {
      limit,
      page,
      total,
    },
  };
};

const getMyFollowingShopsFromDB = async (
  authUser: IAuthUser,
  paginationOptions: IPaginationOptions,
) => {
  const { limit, skip, page } = calculatePagination(paginationOptions);

  const whereConditions: Prisma.FollowerWhereInput = {
    customer: {
      userId: authUser.id,
    },
  };

  const data = await prisma.follower.findMany({
    where: whereConditions,
    take: limit,
    skip,
    select: {
      shop: {
        select: {
          id: true,
          name: true,
          logo: true,
          _count: true,
        },
      },
    },
  });

  const total = await prisma.follower.count({ where: whereConditions });

  return {
    data,
    meta: {
      limit,
      page,
      total,
    },
  };
};

const FollowerServices = {
  createFollowerIntoDB,
  deleteFollowerFromDB,
  getMyShopFollowersFromDB,
  getMyFollowingShopsFromDB,
};

export default FollowerServices;

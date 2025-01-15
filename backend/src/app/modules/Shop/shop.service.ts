import { Prisma, Shop } from "@prisma/client";
import { IAuthUser } from "../Auth/auth.interface";
import prisma from "../../shared/prisma";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import { IShopFilterData, IUpdateShopData } from "./shop.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";

const createShopIntoDB = async (authUser: IAuthUser, payload: Shop) => {
  const shop = await prisma.shop.findFirst({
    where: {
      vendor: {
        userId: authUser.id,
      },
    },
  });

  console.log(authUser);

  // Checking shop existence
  if (shop) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Shop already exist");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      userId: authUser.id,
    },
  });

  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  payload.vendorId = vendor.id;

  return await prisma.shop.create({
    data: payload,
  });
};

const getShopsFromDB = async (
  filterData: IShopFilterData,
  paginationOptions: IPaginationOptions,
) => {
  const whereConditions: Prisma.ShopWhereInput = {};
  const { limit, skip, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  if (filterData.searchTerm) {
    whereConditions.name = {
      contains: filterData.searchTerm,
      mode: "insensitive",
    };
  }

  const data = await prisma.shop.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy: {
      [orderBy]: sortOrder,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      _count: true,
    },
  });
  const total = await prisma.shop.count({
    where: whereConditions,
  });
  return {
    data,
    meta: {
      total,
      limit,
      page,
    },
  };
};

const getBlacklistedShopsFromDB = async (
  filterData: IShopFilterData,
  paginationOptions: IPaginationOptions,
) => {
  const whereConditions: Prisma.ShopWhereInput = {
    isBlackListed: true,
  };
  const { limit, skip, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  if (filterData.searchTerm) {
    whereConditions.name = {
      contains: filterData.searchTerm,
      mode: "insensitive",
    };
  }

  const data = await prisma.shop.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy: {
      [orderBy]: sortOrder,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      _count: true,
    },
  });
  const total = await prisma.shop.count({
    where: whereConditions,
  });
  return {
    data,
    meta: {
      total,
      limit,
      page,
    },
  };
};

const changeShopBlacklistStatus = async (
  shopId: string,
  payload: { status: boolean },
) => {
  const shop = await prisma.shop.findUnique({
    where: {
      id: shopId,
    },
  });

  // Check shop existence
  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  //    Check is the shop is already blacklisted
  else if (shop.isBlackListed && payload.status === true) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Shop is already blacklisted",
    );
  }
  //    Check is the shop is already whitelisted
  else if (!shop.isBlackListed && payload.status === false) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Shop is already  whitelisted",
    );
  }

  return await prisma.shop.update({
    where: {
      id: shopId,
    },
    data: {
      isBlackListed: payload.status,
    },
  });
};

const updateShopIntoDB = async (
  authUser: IAuthUser,
  payload: IUpdateShopData,
) => {
  const shop = await prisma.shop.findFirst({
    where: {
      vendor: {
        userId: authUser.id,
      },
    },
  });

  // Check shop existence
  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }
  return await prisma.shop.update({
    where: {
      id: shop.id,
    },
    data: payload,
  });
};

const getMyShopExistStatusFromDB = async (authUser: IAuthUser) => {
  const shop = await prisma.shop.findFirst({
    where: {
      vendor: {
        userId: authUser.id,
      },
    },
  });

  console.log(shop);

  return { status: shop ? true : false };
};

const ShopServices = {
  createShopIntoDB,
  updateShopIntoDB,
  changeShopBlacklistStatus,
  getShopsFromDB,
  getBlacklistedShopsFromDB,
  getMyShopExistStatusFromDB,
};

export default ShopServices;

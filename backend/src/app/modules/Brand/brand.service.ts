import { Prisma } from "@prisma/client";
import AppError from "../../Errors/AppError";
import { IPaginationOptions } from "../../interfaces/pagination";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import {
  ICreateBrandPayload,
  IFilterBrands,
  IUpdateBrandPayload,
} from "./brand.interface";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IAuthUser } from "../Auth/auth.interface";

const createBrandIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateBrandPayload,
) => {
  const brand = await prisma.brand.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (brand) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Brand already exist in this name",
    );
  }
  const result = await prisma.$transaction(async (txClient) => {
    const createdBrand = await txClient.brand.create({
      data: payload,
    });
    await txClient.activityLog.create({
      data: {
        staffId: authUser.staffId!,
        action: `New brand(${createdBrand.name}) created id:${createdBrand.id}`,
      },
    });
    return createdBrand;
  });
  return result;
};

const getBrandsFromDB = async (
  filter: IFilterBrands,
  paginationOptions: IPaginationOptions,
) => {
  const andConditions: Prisma.BrandWhereInput[] = [];
  const { searchTerm, origin } = filter;
  if (searchTerm) {
    andConditions.push({
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    });
  }
  if (origin) {
    andConditions.push({
      origin,
    });
  }

  const { skip, limit, page, orderBy, sortOrder } =
    calculatePagination(paginationOptions);

  const whereConditions = {
    AND: andConditions,
  };

  const data = await prisma.brand.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  const total = await prisma.brand.count({
    where: whereConditions,
  });
  const meta = {
    limit,
    page,
    total,
  };
  return {
    data,
    meta,
  };
};

const getPopularBrandsFromDB = async (
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, page } = calculatePagination(paginationOptions);

  const data = await prisma.brand.findMany({
    where: {
      isPopular: true,
    },
    skip,
    take: limit,
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  const total = await prisma.brand.count({
    where: {
      isPopular: true,
    },
  });
  const meta = {
    limit,
    page,
    total,
  };
  return {
    data,
    meta,
  };
};

const updateBrandIntoDB = async (
  authUser: IAuthUser,
  id: string,
  payload: IUpdateBrandPayload,
) => {
  const brand = await prisma.brand.findUnique({
    where: {
      id,
    },
  });

  if (!brand) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }

  //   Check brand name if it  changed
  if (payload.name && payload.name !== brand.name) {
    const brand = await prisma.brand.findUnique({
      where: {
        name: payload.name,
      },
    });
    if (brand) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Brand is exist in this name",
      );
    }
  }

  const result = await prisma.$transaction(async (txClient) => {
    const updatedBrand = await txClient.brand.update({
      where: {
        id,
      },
      data: payload,
    });
    await txClient.activityLog.create({
      data: {
        staffId: authUser.staffId!,
        action: `Updated brand  id:${updatedBrand.id}`,
      },
    });
    return updatedBrand;
  });
  return result;
};

const BrandServices = {
  createBrandIntoDB,
  getBrandsFromDB,
  getPopularBrandsFromDB,
  updateBrandIntoDB,
};

export default BrandServices;

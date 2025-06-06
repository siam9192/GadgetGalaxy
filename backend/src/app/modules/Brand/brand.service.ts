import { Prisma } from "@prisma/client";
import AppError from "../../Errors/AppError";
import { IPaginationOptions } from "../../interfaces/pagination";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import {
  IBrandsFilterQuery,
  ICreateBrandPayload,
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
    await txClient.administratorActivityLog.create({
      data: {
        administratorId: authUser.administratorId!,
        action: `✨ Created New Brand "${createdBrand.name}". (ID: ${createdBrand.id})`,
      },
    });
    return createdBrand;
  });
  return result;
};

const getBrandsFromDB = async (
  filter: IBrandsFilterQuery,
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

  const totalResult = await prisma.brand.count({
    where: whereConditions,
  });
  const meta = {
    limit,
    page,
    totalResult,
  };
  return {
    data,
    meta,
  };
};

const getBrandsForManageFromDB = async (
  filter: IBrandsFilterQuery,
  paginationOptions: IPaginationOptions,
) => {
  const andConditions: Prisma.BrandWhereInput[] = [];
  const { searchTerm, origin } = filter;

  // If the searchTerm is change to be id  than search brand base on id only  other wise apply
  if (searchTerm && !Number.isNaN(searchTerm)) {
    andConditions.push({
      id: Number(searchTerm),
    });
  } else {
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

  const totalResult = await prisma.brand.count({
    where: whereConditions,
  });
  const meta = {
    limit,
    page,
    totalResult,
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

  const totalResult = await prisma.brand.count({
    where: {
      isPopular: true,
    },
  });
  const meta = {
    limit,
    page,
    totalResult,
  };
  return {
    data,
    meta,
  };
};

const getFeaturedBrandsFromDB = async (
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, page } = calculatePagination(paginationOptions);

  const data = await prisma.brand.findMany({
    where: {
      isFeatured: true,
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

  const totalResult = await prisma.brand.count({
    where: {
      isPopular: true,
    },
  });
  const meta = {
    limit,
    page,
    totalResult,
  };
  return {
    data,
    meta,
  };
};

const getTopBrandsFromDB = async (paginationOptions: IPaginationOptions) => {
  const { skip, limit, page } = calculatePagination(paginationOptions);

  const data = await prisma.brand.findMany({
    where: {
      isFeatured: true,
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

  const totalResult = await prisma.brand.count({
    where: {
      isTop: true,
    },
  });
  const meta = {
    limit,
    page,
    totalResult,
  };
  return {
    data,
    meta,
  };
};

const updateBrandIntoDB = async (
  authUser: IAuthUser,
  id: string | number,
  payload: IUpdateBrandPayload,
) => {
  id = Number(id);
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
    // await txClient.activityLog.create({
    //   data: {
    //     staffId: authUser.staffId!,
    //     action: `Updated brand  id:${updatedBrand.id}`,
    //   },
    // });
    return updatedBrand;
  });
  return result;
};

const getSearchRelatedBrandsFromDB = async (filterQuery: {
  searchTerm?: string;
}) => {
  const { searchTerm } = filterQuery;

  // Group categories
  const groupResult = await prisma.brand.groupBy({
    where: {
      products: {
        some: {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },
    },
    by: "id",
  });

  //  Retrieve group categories
  const data = await prisma.brand.findMany({
    where: {
      id: {
        in: groupResult.map((_) => _.id),
      },
    },
  });
  return data;
};

const getCategoryRelatedBrandsFromDB = async (slug: string) => {
  const brands = await prisma.brand.findMany({
    where: {
      products: {
        some: {
          categories: {
            some: {
              category: {
                slug,
              },
            },
          },
        },
      },
    },
  });

  return brands;
};

const getSearchKeywordBrandsFromDB = async (keyword: string) => {
  const brands = await prisma.brand.findMany({
    where: {
      name: {
        contains: keyword,
        mode: "insensitive",
      },
    },
  });
  return brands;
};

const BrandServices = {
  createBrandIntoDB,
  getBrandsFromDB,
  getBrandsForManageFromDB,
  getPopularBrandsFromDB,
  getFeaturedBrandsFromDB,
  getTopBrandsFromDB,
  getSearchRelatedBrandsFromDB,
  getCategoryRelatedBrandsFromDB,
  getSearchKeywordBrandsFromDB,
  updateBrandIntoDB,
};

export default BrandServices;

import { ProductStatus } from "@prisma/client";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { IAuthUser } from "../Auth/auth.interface";
import { productSelect } from "../../utils/constant";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import { ICrateWishListItemPayload } from "./wishListItem.interface";

const createWishListItemIntoDB = async (
  authUser: IAuthUser,
  payload: ICrateWishListItemPayload,
) => {
  
  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
    },
  });
  if (!product) throw new AppError(httpStatus.NOT_FOUND, "Product not found");

  return await prisma.wishListItem.upsert({
    where: {
      productId_customerId: {
        customerId: authUser.customerId!,
        productId: payload.productId,
      },
    },
    update: {
      productId: payload.productId,
    },
    create: {
      customerId: authUser.customerId!,
      productId: payload.productId,
    },
  });
};

const deleteWishListItemFromDB = async (
  authUser: IAuthUser,
  productId: string | number,
) => {
  productId = Number(productId);
  const item = await prisma.wishListItem.findUnique({
    where: {
      productId_customerId: {
        customerId: authUser.customerId!,
        productId: productId,
      },
    },
  });

  if (!item)
    throw new AppError(httpStatus.NOT_FOUND, "Product not found in wishlist");
  await prisma.wishListItem.delete({
    where: {
      productId_customerId: {
        customerId: authUser.customerId!,
        productId: productId,
      },
    },
  });
};

const getWishListItemsFromDB = async (
  authUser: IAuthUser,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } = calculatePagination(paginationOptions);

  const whereConditions = {
    customerId: authUser.customerId!,
    product: {
      status: ProductStatus.ACTIVE,
    },
  };
  const items = await prisma.wishListItem.findMany({
    where: whereConditions,
    select: {
      product: {
        select: productSelect,
      },
    },
    take: limit,
    skip,
  });

  const totalResult = await prisma.wishListItem.count({
    where: whereConditions,
  });

  const data = items.map((_) => ({ ..._.product }));
  const meta = {
    page,
    limit,
    totalResult,
  };

  return {
    data,
    meta,
  };
};
const WishListItemServices = {
  createWishListItemIntoDB,
  deleteWishListItemFromDB,
  getWishListItemsFromDB,
};

export default WishListItemServices;

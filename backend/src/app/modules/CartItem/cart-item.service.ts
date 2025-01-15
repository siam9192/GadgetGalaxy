import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { IAuthUser } from "../Auth/auth.interface";

const createCartItemIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateCartItemPayload,
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
    },
  });

  if (!product) throw new AppError(httpStatus.NOT_FOUND, "Product not found");

  const customer = await prisma.customer.findFirst({
    where: {
      userId: authUser.id,
    },
    select: {
      id: true,
    },
  });

  if (!customer)
    throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");

  const result = await prisma.cartItem.upsert({
    where: {
      customerId_productId: {
        customerId: customer.id,
        productId: payload.productId,
      },
    },
    create: {
      customerId: customer.id,
      productId: payload.productId,
      quantity: payload.quantity,
    },
    update: {
      quantity: {
        increment: payload.quantity,
      },
    },
  });
  return result;
};

const deleteCartItemFromDB = async (authUser: IAuthUser, productId: string) => {
  await prisma.cartItem.deleteMany({
    where: {
      customer: {
        userId: authUser.id,
      },
      productId: productId,
    },
  });

  return null;
};

const getMyCartItemsFromDB = async (authUser: IAuthUser) => {
  const data = await prisma.cartItem.findMany({
    where: {
      customer: {
        userId: authUser.id,
      },
    },

    include: {
      product: {
        select: {
          id: true,
          name: true,
          regularPrice: true,
          salePrice: true,
          images: true,
        },
      },
    },
  });

  const result = await data.map((item) => ({}));
};

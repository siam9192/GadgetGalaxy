import { Prisma } from "@prisma/client";
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
    select: {
      id: true,
      _count: {
        select: {
          variants: true,
        },
      },
    },
  });

  if (!product) throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  else if (!payload.variantId && product._count.variants !== 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Variant id is required");
  }
  // If variant id exist then check variant existence in db
  if (payload.variantId) {
    const variant = await prisma.variant.findUnique({
      where: {
        id: payload.variantId,
        productId: payload.productId,
      },
      select: {
        id: true,
      },
    });
    if (!variant) {
      throw new AppError(httpStatus.NOT_FOUND, "Variant not found");
    }
  }

  const whereConditions: Prisma.CartItemWhereInput = {
    customerId: authUser.customerId!,
    productId: payload.productId,
    // id:"sss"
  };

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      customerId: authUser.customerId!,
      productId: payload.productId,
    },
  });
  let result;

  if (cartItem) {
    result = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        variantId: payload.variantId,
        quantity: payload.quantity,
      },
    });
  } else {
    const data: any = {
      customerId: authUser.customerId!,
      productId: payload.productId,
      quantity: payload.quantity,
    };

    if (payload.variantId) {
      data.variantId = payload.variantId;
    }
    result = await prisma.cartItem.create({
      data: data,
    });
  }

  return result;
};

const deleteCartItemFromDB = async (authUser: IAuthUser, id: string) => {
  await prisma.cartItem.delete({
    where: {
      id,
      customerId: authUser.customerId,
    },
  });

  return null;
};

const getMyCartItemsFromDB = async (authUser: IAuthUser) => {
  const items = await prisma.cartItem.findMany({
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
      variant: true,
    },
  });
  const result = items.map((item) => ({
    id: item.id,
    product: {
      ...item.product,
      variant: item.variant,
    },
    quantity: item.quantity,
  }));
  return result;
};

const CartItemServices = {
  createCartItemIntoDB,
  getMyCartItemsFromDB,
  deleteCartItemFromDB,
};

export default CartItemServices;

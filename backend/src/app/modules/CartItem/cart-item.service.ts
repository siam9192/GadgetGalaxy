import { Prisma, ProductStatus } from "@prisma/client";
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
      status: {
        not: ProductStatus.DELETED,
      },
    },
    select: {
      id: true,
      variants: true,
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
  if (
    payload.variantId &&
    !product.variants.find((_) => _.id === payload.variantId)
  ) {
    throw new AppError(httpStatus.NOT_FOUND, "Variant not found");
  }

  const whereConditions: Prisma.CartItemWhereInput = {
    customerId: authUser.customerId!,
    productId: payload.productId,
  };

  if (payload.variantId) whereConditions.variantId = payload.variantId;

  const cartItem = await prisma.cartItem.findFirst({
    where: whereConditions,
  });

  if (cartItem) {
    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity: payload.quantity,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        customerId: authUser.customerId!,
        productId: payload.productId,
        variantId: payload.variantId,
        quantity: payload.quantity,
      },
    });
  }
  return null;
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
          price: true,
          offerPrice: true,
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

const changeProductQuantity = async (payload:{id:string,quantity:number})=>{
   await prisma.cartItem.update({
   where:{
    id:payload.id
   },
   data:{
    quantity:payload.quantity
   }
   })
   return null
}

const changeItemVariantIntoDB = async (authUser:IAuthUser,payload:{
  id:string,
  variantId:number
})=>{
  const cartItem = await prisma.cartItem.findUnique({
    where:{
      id:payload.id,
      customerId:authUser.customerId
    }
  })
  if(!cartItem) throw new AppError(httpStatus.NOT_FOUND,"Cart item not found")
  
   // Checking is that variant already exist in the cart
   if( await prisma.cartItem.findFirst({
    where:{
      customerId:authUser.customerId,
      productId:cartItem.productId,
      variantId:payload.variantId
    }
  })){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,"Already exist")
  }
 

  await prisma.cartItem.update({
    where:{
     id:payload.id
    },
    data:{
      variantId:payload.variantId
    }
  })
 
  return null
}

const CartItemServices = {
  createCartItemIntoDB,
  changeItemVariantIntoDB,
  getMyCartItemsFromDB,
  deleteCartItemFromDB,
};

export default CartItemServices;

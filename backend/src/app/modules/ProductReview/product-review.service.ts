import { OrderStatus, Prisma, ProductReviewStatus } from "@prisma/client";
import AppError from "../../Errors/AppError";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { IAuthUser } from "../Auth/auth.interface";
import {
  ICreateProductReviewPayload,
  ICreateReviewResponsePayload,
  IUpdateProductReviewPayload,
} from "./product-review.interface";

const createReviewIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateProductReviewPayload,
) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: {
      id: payload.orderItemId,
      order: {
        customerId: authUser.customerId!,
        status: OrderStatus.DELIVERED,
      },
    },
    include: {
      order: {
        select: {
          customerId: true,
        },
      },
    },
  });

  if (!orderItem) {
    throw new AppError(httpStatus.NOT_FOUND, "Order item not found");
  }

  return await prisma.$transaction(async (tx) => {
    await tx.productReview.create({
      data: {
        customerId: orderItem.order.customerId,
        comment: payload.comment,
        rating: payload.rating,
        imagesUrl: payload.imagesUrl,
        orderItemId: payload.orderItemId,
        productId: orderItem.productId,
      },
    });
    const average = await tx.productReview.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        productId: orderItem.productId,
      },
    });

    await tx.product.update({
      where: {
        id: orderItem.productId,
      },
      data: {
        rating: average._avg.rating || 0,
      },
    });

    await tx.orderItem.update({
      where: {
        id: payload.orderItemId,
      },
      data: {
        isReviewed: true,
      },
    });
  });
};

const createReviewResponseIntoDB = async (
  payload: ICreateReviewResponsePayload,
) => {
  const result = await prisma.productReview.update({
    where: {
      id: payload.id,
    },
    data: {
      response: payload.comment,
    },
  });
  return result;
};

const getMyNotReviewedProductsFromDB = async (
  authUser: IAuthUser,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, page, orderBy, sortOrder } =
    calculatePagination(paginationOptions);

  const whereConditions: Prisma.OrderItemWhereInput = {
    order: {
      customer: {
        userId: authUser.id,

      },
      status:OrderStatus.DELIVERED
    },
    isReviewed: false,
  };

  const data = await prisma.orderItem.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy: {
      order: {
        [orderBy]: sortOrder,
      },
    },
  });

  const totalResult = await prisma.orderItem.count({
    where: whereConditions,
  });

  return {
    data: data,
    meta: {
      totalResult,
      skip,
      limit,
      page,
    },
  };
};

const getProductReviewsFromDB = async (
  productId: string | number,
  paginationOptions: IPaginationOptions,
) => {
  productId = Number(productId);

  const { skip, limit, page, orderBy, sortOrder } =
    calculatePagination(paginationOptions);

  const whereConditions: Prisma.ProductReviewWhereInput = {
    id: productId,
    status:ProductReviewStatus.VISIBLE
  };

  const reviews = await prisma.productReview.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy: {
      [orderBy]: sortOrder,
    },
    include:{
      customer:{
        select:{
          fullName:true,
           profilePhoto:true
        }
      }
    }
  });

  const totalResult = await prisma.productReview.count({
    where: whereConditions,
  });

  const total = await prisma.productReview.count({
    where:{
      productId,
      status:ProductReviewStatus.VISIBLE
    },
  });
 

  const data = reviews.map((review)=>{
    return {
      id:review.id,
    comment:review.comment,
    imagesUrl:review.imagesUrl,
    reviewer:{
      name:review.customer.fullName,
      profilePhoto:review.customer.profilePhoto
    },
    rating: review.rating,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    }
  })
  return {
    data,
    meta: {
      totalResult,
      total,
      skip,
      limit,
      page,
    },
  };
};

const getMyReviewsFromDB = async (
  authUser: IAuthUser,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, page, orderBy, sortOrder } =
    calculatePagination(paginationOptions);

  const whereConditions: Prisma.ProductReviewWhereInput = {
    customerId: authUser.customerId!,
  };

  const data = await prisma.productReview.findMany({
    where: whereConditions,
    include: {
      product: {
        select: {
          name: true,
          images: {
            take: 1,
            select: {
              url: true,
            },
          },
        },
        
      },
      orderItem:true
    },
    take: limit,
    skip,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const totalResult = await prisma.productReview.count({
    where: whereConditions,
  });

  const filteredData = data.map((item) => {

    return {
      id: item.id,
      comment: item.comment,
      imagesUrl:item.imagesUrl,
      rating: item.rating,
      response: item.response,
      item:item.orderItem,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  });

  return {
    data: filteredData,
    meta: {
      totalResult,
      skip,
      limit,
      page,
    },
  };
};

const updateReviewIntoDB = async (
  authUser: IAuthUser,
  id: string | number,
  payload: IUpdateProductReviewPayload,
) => {
  id = Number(id);
  const review = await prisma.productReview.findUnique({
    where: {
      id: id,
      customerId: authUser.customerId,
    },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedReview = await tx.productReview.update({
      where: {
        id: id,
      },
      data: payload,
    });
    if (payload.rating) {
      const average = await tx.productReview.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          productId: review.productId,
        },
      });

      await tx.product.update({
        where: {
          id: review.productId,
        },
        data: {
          rating: average._avg.rating || 0,
        },
      });
    }
    return updatedReview;
  });
  return result;
};

const changeReviewStatusIntoDB = async (payload: {
  id: number;
  status: `${ProductReviewStatus}`;
}) => {
  const review = await prisma.productReview.findUnique({
    where: {
      id: payload.id,
    },
  });
  if (!review) throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  await prisma.productReview.update({
    where: {
      id: payload.id,
    },
    data: {
      status: payload.status,
    },
  });
};

const ProductReviewServices = {
  createReviewIntoDB,
  createReviewResponseIntoDB,
  getMyNotReviewedProductsFromDB,
  getMyReviewsFromDB,
  getProductReviewsFromDB,
  updateReviewIntoDB,
  changeReviewStatusIntoDB,
};

export default ProductReviewServices;

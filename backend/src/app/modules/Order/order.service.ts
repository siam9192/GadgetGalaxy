import e from "express";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { ICreateOrderPayload } from "./order.interface";
import { DiscountType, PaymentMethod, Prisma, UserRole } from "@prisma/client";
import { IAuthUser } from "../Auth/auth.interface";
import { stripePayment } from "../../PaymentMethod/stripePayment";
import { sslcommerzPayment } from "../../PaymentMethod/sslCommez";
import config from "../../config";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";

const createOrderIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateOrderPayload,
) => {
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: payload.items.map((item) => item.productId),
      },
    },
    select: {
      id: true,
      salePrice: true,
      stock: true,
    },
  });

  if (products.length !== payload.items.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const calculatedItems = payload.items.map((item) => {
    const product = products.find((ele) => ele.id === item.productId);
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
    return {
      ...item,
      price: product.salePrice,
      subTotal: product.salePrice * item.quantity,
    };
  });

  let subTotal = calculatedItems.reduce((p, c) => {
    return p + c.price;
  }, 0);

  let discount = 0;

  let shippingFee = 5;

  if (payload.couponId) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        id: payload.couponId,
      },
    });
    // Check coupon existence
    if (!coupon) {
      throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
    }
    if (coupon.minOrderValue && coupon.minOrderValue > subTotal) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `Coupon can not applicable in this order because minimum order value is  ${coupon.minOrderValue}`,
      );
    }

    if (coupon.discountValue) {
      if (coupon.discountType === DiscountType.Fixed) {
        discount = coupon.discountValue;
      } else {
        discount = (coupon.discountValue / 100) * subTotal;
      }
    }
  }

  const totalAmount = subTotal;
  const finalAmount = parseFloat(
    (totalAmount - discount + shippingFee).toFixed(2),
  );

  const customer = await prisma.customer.findUnique({
    where: {
      userId: authUser.id,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const orderData = {
      customerId: customer!.id,
      totalAmount,
      finalAmount,
      shippingFee,
      discountAmount: discount,
    };
    const createdOrder = await tx.order.create({
      data: orderData,
    });

    await tx.orderItem.createMany({
      data: calculatedItems.map((item) => ({
        ...item,
        orderId: createdOrder.id,
      })),
    });

    await tx.shippingAddress.create({
      data: {
        ...payload.shippingAddress,
        orderId: createdOrder.id,
      },
    });

    const today = new Date();
    const transactionId = `STRIPE-${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}${today.getMilliseconds()}`;

    const paymentData = {
      transactionId,
      orderId: createdOrder.id,
      customerId: customer!.id,
      amount: finalAmount,
      method: PaymentMethod.Stripe,
    };

    const createdPayment = await tx.payment.create({
      data: paymentData,
    });

    await tx.order.update({
      where: {
        id: createdOrder.id,
      },
      data: {
        paymentId: createdPayment.id,
      },
    });

    const paymentUrl = await sslcommerzPayment({
      amount: createdPayment.amount,
      transactionId: createdPayment.amount,
      successUrl: `${config.backend_base_api}/payments/${createdPayment.id}/success`,
      cancelUrl: `${config.backend_base_api}/payments/${createdPayment.id}/cancel`,
      service_name: "",
    });
    return paymentUrl;
  });

  return {
    paymentUrl: result,
  };
};

const getMyOrdersFromDB = async (
  authUser: IAuthUser,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, sortOrder, orderBy, page } =
    calculatePagination(paginationOptions);

  const whereConditions =
    authUser.role === UserRole.Customer
      ? {
          customer: {
            userId: authUser.id,
          },
        }
      : {
          shop: {
            vendor: {
              userId: authUser.id,
            },
          },
        };

  const include: Prisma.OrderInclude =
    authUser.role === UserRole.Vendor
      ? {
          customer: {
            select: {
              firstName: true,
              lastName: true,
              profilePhoto: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: {
                    select: {
                      url: true,
                    },
                    take: 1,
                  },
                },
              },
            },
          },
        }
      : {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: {
                    select: {
                      url: true,
                    },
                    take: 1,
                  },
                },
              },
            },
            take: 2,
          },
        };

  const orders = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
    include,
  });

  const total = await prisma.order.count({
    where: whereConditions,
  });

  return {
    data: orders,
    meta: {
      limit,
      total,
      page,
    },
  };
};

const OrderServices = {
  createOrderIntoDB,
  getMyOrdersFromDB,
};

export default OrderServices;

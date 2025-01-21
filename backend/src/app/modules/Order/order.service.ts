import e from "express";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import {
  ICreateOrderPayload,
  IFilterOrder,
  IUpdateOrderStatusPayload,
} from "./order.interface";
import { DiscountType, OrderStatus, Prisma, UserRole } from "@prisma/client";
import { IAuthUser } from "../Auth/auth.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import PaymentServices from "../Payment/payment.service";
import { IInitPaymentPayload } from "../Payment/payment.interface";
import { formatExceptedDeliveryDate } from "./order.function";

const initOrderIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateOrderPayload,
) => {
  const cartItems = await prisma.cartItem.findMany({
    where: {
      id: {
        in: payload.cartItemsId,
      },
      product: {
        status: "Active",
      },
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
      variant: {
        include: {
          attributes: true,
        },
      },
    },
  });

  let totalAmount = 0;
  let discountAmount = 0;
  let grossAmount = 0;
  let shippingAmount = 0;
  let netAmount = 0;

  if (cartItems.length !== payload.cartItemsId.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Item  not found in cart");
  }

  const shippingCharge = await prisma.shippingCharge.findUnique({
    where: {
      id: payload.shippingChargeId,
    },
  });

  if (!shippingCharge) {
    throw new AppError(httpStatus.NOT_FOUND, "shipping charge not found");
  } else {
    shippingAmount = shippingCharge.cost;
  }

  const items = cartItems.map((item) => {
    const variant = item.variant;
    const price = variant ? variant.salePrice : item.product?.salePrice!;
    const quantity = item.quantity;
    return {
      productId: item.productId,
      variantId: variant || null,
      productName: item.product.name,
      imageUrl: item.product.images[0],
      colorName: variant?.colorName || null,
      attributes: variant?.attributes || null,
      quantity,
      price,
      totalAmount: price! * quantity,
    };
  });

  // Calculate subtotal of items
  const subTotal = items.reduce((p, c) => {
    return p + c.price;
  }, 0);

  // Id discount id exist then apply discount after validation
  if (payload.discountCode) {
    const discount = await prisma.discount.findFirst({
      where: {
        code: payload.discountCode,
      },
    });
    // Check discount existence
    if (!discount) {
      throw new AppError(httpStatus.NOT_FOUND, "discount not found");
    }
    if (discount.minOrderValue && discount.minOrderValue > subTotal) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `discount can not applicable in this order because minimum order value is  ${discount.minOrderValue}`,
      );
    }

    if (discount.discountValue) {
      if (discount.discountType === DiscountType.Fixed) {
        discountAmount = discount.discountValue;
      } else {
        discountAmount = (discount.discountValue / 100) * subTotal;
      }
    }
  }

  totalAmount = subTotal;
  grossAmount = parseFloat((totalAmount - discountAmount).toFixed(2));
  netAmount = grossAmount + shippingAmount;

  const exceptedDeliveryDate = formatExceptedDeliveryDate(shippingCharge.deliveryHours);

  

  const result = await prisma.$transaction(async (txClient) => {
    const createdOrder = await txClient.order.create({
      data: {
        customerId: authUser.customerId!,
        totalAmount,
        discountAmount,
        grossAmount,
        shippingAmount,
        netAmount,
        discountCode: payload.discountCode || null,
        shippingChargeData: {
          title: shippingCharge.title,
          description: shippingCharge.description,
          cost: shippingCharge.cost,
        },
        notes: payload.notes,
        exceptedDeliveryDate,
        deletableCartItemsId: payload.removeCartItemsAfterPurchase
          ? payload.cartItemsId.join(",")
          : null,
      },
    });

    const shippingInfo = payload.shippingInfo;

    let { address, addressId, ...otherShippingInfo } = shippingInfo;

    if (addressId) {
      const findAddress = await txClient.address.findUnique({
        where: {
          id: addressId,
        },
        select: {
          district: true,
          zone: true,
          line: true,
        },
      });
      if (!findAddress) {
        throw new AppError(httpStatus.NOT_FOUND, "Address not found");
      }
      address = findAddress;
    }

    await txClient.shippingInformation.create({
      data: {
        orderId: createdOrder.id,
        ...otherShippingInfo,
        ...address,
      },
    });

    return {
      orderId: createdOrder.id,
    };
  });

  const shippingInfo = payload.shippingInfo;

  const { paymentId, paymentUrl } = await PaymentServices.initPayment({
    orderId: result.orderId,
    amount: grossAmount,
    customer: {
      name: shippingInfo.fullName,
      email: shippingInfo.emailAddress,
      phone: shippingInfo.phoneNumber,
    },
    shippingAddress: Object.values(shippingInfo.address).join(","),
  });

  await prisma.order.update({
    where: {
      id: result.orderId,
    },
    data: {
      paymentId,
    },
  });

  return {
    paymentUrl,
  };
};

const UpdateOrderStatus = async (payload: IUpdateOrderStatusPayload) => {
  const order = await prisma.order.findUnique({
    where: {
      id: payload.orderId,
    },
  });
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (
    order.status === OrderStatus.Canceled &&
    payload.status !== OrderStatus.Placed
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Sorry.The order can not be canceled now",
    );
  } else if (
    order.status === OrderStatus.Delivered &&
    !["Pending", "Placed"].includes(payload.status)
  ) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Order is delivered");
  }

  return await prisma.order.update({
    where: {
      id: payload.orderId,
    },
    data: {
      status: payload.status,
    },
    select: {
      id: true,
      status: true,
    },
  });
};

const getMyOrdersFromDB = async (
  authUser: IAuthUser,
  filter: IFilterOrder,
  paginationOptions: IPaginationOptions,
) => {

  
};

const OrderServices = {
  initOrderIntoDB,
  getMyOrdersFromDB,
};

export default OrderServices;

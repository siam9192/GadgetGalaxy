import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import {
  ICreateOrderPayload,
  IFilterMyOrder,
  IFilterOrder,
  IUpdateOrderStatusPayload,
} from "./order.interface";
import {
  DiscountType,
  OrderPaymentStatus,
  OrderStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { IAuthUser } from "../Auth/auth.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import PaymentServices from "../Payment/payment.service";
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
      variantId: item.variantId || null,
      productName: item.product.name,
      imageUrl: item.product.images[0].url,
      colorName: variant?.colorName || null,
      colorCode: variant?.colorCode || null,
      attributes: variant?.attributes,
      quantity,
      price,
      totalAmount: price * quantity,
    };
  });

  // Checking  stock
  cartItems.forEach((item) => {
    const product = item.product;
    const variant = item.variant;

    if (product && !variant) {
      if (product.stock! < item.quantity) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          `Stock not available.${product.name} ${item.quantity} quantity not available`,
        );
      }
    } else {
      if (variant!.stock < item.quantity) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          `Stock not available.${product.name} ${item.quantity} quantity not available`,
        );
      }
    }
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

  const exceptedDeliveryDate = formatExceptedDeliveryDate(
    shippingCharge.deliveryHours,
  );

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

    await txClient.orderItem.createMany({
      data: items.map((item) => ({
        orderId: createdOrder.id,
        ...item,
      })),
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

    const stockUpdatableVariants = items
      .filter((item) => item.variantId !== null)
      .map((item) => ({
        id: item.variantId,
        quantity: item.quantity,
      }));

    const stockUpdatableProducts = items
      .filter((item) => item.variantId === null)
      .map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      }));

    // Decrease stock of variant
    for (let i = 0; i < stockUpdatableVariants.length; i++) {
      const data = stockUpdatableVariants[0];
      await txClient.variant.update({
        where: {
          id: data.id!,
        },
        data: {
          stock: {
            decrement: data.quantity,
          },
        },
      });
    }

    // Decrease stock of product
    for (let i = 0; i < stockUpdatableProducts.length; i++) {
      const data = stockUpdatableProducts[0];
      await txClient.variant.update({
        where: {
          id: data.id!,
        },
        data: {
          stock: {
            decrement: data.quantity,
          },
        },
      });
    }

    return {
      orderId: createdOrder.id,
    };
  });

  const shippingInfo = payload.shippingInfo;

  const { paymentId, paymentUrl } = await PaymentServices.initPayment({
    method: payload.paymentMethod,
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

const PlaceOrderAfterPaymentIntoDB = async (
  orderId: string,
  tx: Prisma.TransactionClient,
) => {
  const updatedOrderData = await tx.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: OrderStatus.Placed,
      paymentStatus: OrderPaymentStatus.Paid,
    },
  });

  const deletableCartItemsId = updatedOrderData.deletableCartItemsId;

  // If deletable cart items exist then delete cart items from db
  if (deletableCartItemsId) {
    await tx.cartItem.deleteMany({
      where: {
        id: {
          in: deletableCartItemsId.split(","),
        },
      },
    });
  }
};

const UpdateOrderStatusByStaffIntoDB = async (
  authUser: IAuthUser,
  payload: IUpdateOrderStatusPayload,
) => {
  const order = await prisma.order.findUnique({
    where: {
      id: payload.orderId,
    },
  });
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  // If status and isNext is not exist in payload then throw error
  if (!payload.status && payload.isNext === undefined) {
    throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
  }
  //  If is next option is true then go to next order status
  else if (payload.isNext) {
    const currentStatus = order.status;
    switch (currentStatus) {
      case OrderStatus.Placed:
        payload.status = OrderStatus.Processing;
      case OrderStatus.InTransit:
        payload.status = OrderStatus.OutForDelivery;
      case OrderStatus.OutForDelivery:
        payload.status = OrderStatus.Delivered;
      case OrderStatus.Returned:
        payload.status = OrderStatus.Returned;
    }
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

  const result = await prisma.$transaction(async (txClient) => {
    await prisma.activityLog.create({
      data: {
        staffId: authUser.staffId!,
        action: `Updated the order status ${order.status} to ${payload.status} orderId:${order.id}`,
      },
    });
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
  });
  return result;
};

const getOrdersFromDB = async (
  filter: IFilterOrder,
  paginationOptions: IPaginationOptions,
) => {
  const { customerId, orderDate, orderId, status } = filter;
  const { skip, limit, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.OrderWhereInput[] = [];

  // Add a condition to filter by customerId if it's provided
  if (customerId) {
    andConditions.push({
      customerId: filter.customerId, // Match orders with the given customerId
    });
  }

  // Add a condition to filter by order status if it's provided
  if (status) {
    andConditions.push({
      status, // Match orders with the given status
    });
  }

  // Add a condition to filter by order date if it's provided and valid
  if (orderDate && !isNaN(new Date(orderDate).getTime())) {
    const date = new Date(orderDate); // Convert orderDate to a Date object
    const nextDate = new Date(date); // Clone the date object
    nextDate.setDate(date.getDate() + 1); // Add one day to calculate the next day

    // Filter orders created on the specific date
    andConditions.push({
      createdAt: {
        gte: date,
        lt: nextDate,
      },
    });
  }

  const whereConditions: Prisma.OrderWhereInput = {
    status: {
      not: "Pending",
    },
    paymentStatus: "Paid",
  };

  // If orderId is provided, filter only by orderId and ignore other conditions
  if (!orderId) {
    whereConditions.AND = andConditions; // Use the AND conditions if no specific orderId is provided
  } else {
    whereConditions.id = orderId; // Filter by the specific orderId
  }

  const data = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    select: {
      id: true,
      customer: true,
      items: true,
      totalAmount: true,
      discountAmount: true,
      grossAmount: true,
      shippingAmount: true,
      netAmount: true,
      notes: true,
      exceptedDeliveryDate: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
    },
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const total = await prisma.order.count({
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

const getMyOrdersFromDB = async (
  authUser: IAuthUser,
  filter: IFilterMyOrder,
  paginationOptions: IPaginationOptions,
) => {
  const { startDate, endDate, status } = filter;
  const { skip, limit, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.OrderWhereInput[] = [];

  if (startDate || endDate) {
    const validate = (date: string) => {
      return !isNaN(new Date(date).getTime());
    };

    if (startDate && validate(startDate) && endDate && validate(endDate)) {
      andConditions.push({
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      });
    } else if (startDate && validate(startDate)) {
      andConditions.push({
        createdAt: {
          gte: new Date(startDate),
        },
      });
    } else if (endDate && validate(endDate)) {
      andConditions.push({
        createdAt: {
          lte: new Date(endDate),
        },
      });
    }
  }

  // Add a condition to filter by order status if it's provided
  if (status) {
    andConditions.push({
      status, // Match orders with the given status
    });
  }

  const whereConditions: Prisma.OrderWhereInput = {
    customerId: authUser.customerId,
    status: {
      not: "Pending",
    },
    paymentStatus: "Paid",
    AND: andConditions,
  };

  const data = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    select: {
      id: true,
      customer: true,
      items: true,
      totalAmount: true,
      discountAmount: true,
      grossAmount: true,
      shippingAmount: true,
      netAmount: true,
      notes: true,
      exceptedDeliveryDate: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
    },
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const total = await prisma.order.count({
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

const getOrderByIdFromDB = async (authUser: IAuthUser, id: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
      status: {
        not: "Pending",
      },
      paymentStatus: "Paid",
    },
    select: {
      id: true,
      customer: true,
      items: true,
      totalAmount: true,
      discountAmount: true,
      grossAmount: true,
      shippingAmount: true,
      netAmount: true,
      shippingChargeData: true,
      shippingInfo: true,
      discountCode: true,
      notes: true,
      exceptedDeliveryDate: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  } else if (
    authUser.role === UserRole.Customer &&
    authUser.customerId !== order?.customer.id
  ) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Your not authorized",
      httpStatus.BAD_GATEWAY,
    );
  }

  return order;
};

const getNotReviewedOrderItemsFromDB = async (
  authUser: IAuthUser,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit } = calculatePagination(paginationOptions);
  const data = await prisma.orderItem.findMany({
    where: {
      order: {
        customerId: authUser.customerId,
      },
      isReviewed: false,
    },
    skip,
    take: limit,
  });
  return data;
};

const getStockOutProductsFromDB = async (
  paginationOptions: IPaginationOptions,
) => {
  //      await prisma.order.f
};

const OrderServices = {
  initOrderIntoDB,
  PlaceOrderAfterPaymentIntoDB,
  getMyOrdersFromDB,
  getOrdersFromDB,
  getOrderByIdFromDB,
  getNotReviewedOrderItemsFromDB,
  UpdateOrderStatusByStaffIntoDB,
};

export default OrderServices;

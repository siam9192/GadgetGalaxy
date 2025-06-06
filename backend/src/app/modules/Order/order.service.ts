import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import {
  ICreateOrderPayload,
  IMyOrderFilterQuery,
  IPlaceOrderPayload,
  IUpdateOrderStatusPayload,
} from "./order.interface";
import {
  DiscountType,
  ItemReserveStatus,
  OrderPaymentStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  ProductStatus,
} from "@prisma/client";
import { IAuthUser } from "../Auth/auth.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import PaymentServices from "../Payment/payment.service";
import {
  convertExceptedDeliveryDate,
  getOrderStatusMessage,
} from "../../utils/function";
import NotificationServices from "../Notification/notification.service";

const initOrderIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateOrderPayload,
) => {
  const cartItems = await prisma.cartItem.findMany({
    where: {
      id: { in: payload.cartItemsId },
      product: { status: ProductStatus.ACTIVE },
    },
    include: {
      product: { include: { images: true } },
      variant: { include: { attributes: true } },
    },
  });

  if (cartItems.length !== payload.cartItemsId.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Item not found in cart");
  }

  const shippingCharge = await prisma.shippingCharge.findUnique({
    where: { id: payload.shippingChargeId },
  });

  if (!shippingCharge) {
    throw new AppError(httpStatus.NOT_FOUND, "Shipping charge not found");
  }

  const shippingAmount = shippingCharge.cost;

  // Map cart items for easier processing
  const items = cartItems.map((item) => {
    const variant = item.variant;
    const price = variant
      ? variant.offerPrice || variant.price
      : item.product.offerPrice || item.product.price;
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

  // **Check stock before reserving**
  for (const item of cartItems) {
    const availableQuantity = item.variant
      ? item.variant.availableQuantity
      : item.product.availableQuantity;
    if (availableQuantity < item.quantity) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `Stock not available: ${item.product.name} (${item.quantity} requested, only ${availableQuantity} left)`,
      );
    }
  }

  // **Calculate subtotal**
  const subTotal = items.reduce((p, c) => p + c.price * c.quantity, 0);
  let discountAmount = 0;

  if (payload.discountCode) {
    const discount = await prisma.discount.findFirst({
      where: { code: payload.discountCode },
    });

    if (!discount)
      throw new AppError(httpStatus.NOT_FOUND, "Discount not found");

    if (discount.minOrderValue && discount.minOrderValue > subTotal) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `Discount not applicable. Min order value: ${discount.minOrderValue}`,
      );
    }

    discountAmount =
      discount.discountType === DiscountType.FIXED
        ? discount.discountValue
        : (discount.discountValue / 100) * subTotal;
  }

  const totalAmount = subTotal;
  const grossAmount = parseFloat((totalAmount - discountAmount).toFixed(2));
  const netAmount = grossAmount + shippingAmount;

  return await prisma.$transaction(async (txClient) => {
    // **Create Order**
    const createdOrder = await txClient.order.create({
      data: {
        customerId: authUser.customerId!,
        totalAmount,
        discountAmount,
        grossAmount,
        shippingAmount,
        netAmount,
        discountData: { code: payload.discountCode, discountAmount },
        shippingChargeData: {
          id: shippingCharge.id,
          title: shippingCharge.title,
          description: shippingCharge.description,
          cost: shippingCharge.cost,
        },
        notes: payload.notes,
        exceptedDeliveryDate: convertExceptedDeliveryDate(
          shippingCharge.deliveryHours,
        ),
        status: OrderStatus.PENDING,
        deletableCartItemsId: payload.removeCartItemsAfterPurchase
          ? payload.cartItemsId.join(",")
          : null,
      },
    });

    // **Reserve Stock**
    await txClient.itemReserve.createMany({
      data: cartItems.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    });

    // **Create Order Items**
    await txClient.orderItem.createMany({
      data: items.map((item) => ({ orderId: createdOrder.id, ...item })),
    });

    const stockUpdatableVariants = cartItems
      .filter((_) => _.productId && _.variantId)
      .map((_) => ({ id: _.variantId, quantity: _.quantity }));
    const stockUpdatableProducts = cartItems
      .filter((_) => _.productId && !_.variantId)
      .map((_) => ({ id: _.productId, quantity: _.quantity }));

    await Promise.all(
      stockUpdatableVariants.map((variant) =>
        txClient.variant.update({
          where: { id: variant.id! },
          data: { availableQuantity: { decrement: variant.quantity } },
        }),
      ),
    );

    await Promise.all(
      stockUpdatableProducts.map((product) =>
        txClient.product.update({
          where: { id: product.id! },
          data: { availableQuantity: { decrement: product.quantity } },
        }),
      ),
    );
    // **Save Shipping Info**
    let { address, addressId, ...otherShippingInfo } = payload.shippingInfo;

    if (addressId) {
      const existingAddress = await txClient.customerAddress.findUnique({
        where: { id: addressId },
      });
      if (!existingAddress)
        throw new AppError(httpStatus.NOT_FOUND, "Address not found");

      address = {
        district: existingAddress.district,
        zone: existingAddress.zone,
        line: existingAddress.line,
      };
    }

    const shippingInfo = await txClient.shippingInformation.create({
      data: { orderId: createdOrder.id, ...otherShippingInfo, ...address },
    });

    // **Initialize Payment AFTER successful order creation**
    const { paymentId, paymentUrl } = await PaymentServices.initPayment({
      method: PaymentMethod.SSLCOMMERZ,
      amount: grossAmount,
      customer: {
        name: shippingInfo.fullName,
        email: shippingInfo.emailAddress,
        phone: shippingInfo.phoneNumber,
      },
      shippingAddress: Object.values(address).join(","),
    });
    await txClient.order.update({
      where: { id: createdOrder.id },
      data: { paymentId },
    });

    const productsId = cartItems.map((_) => _.productId);

    for (const pId of productsId) {
      const product = await prisma.product.findUnique({
        where: {
          id: pId,
        },
        select: {
          id: true,
          availableQuantity: true,
          variants: true,
        },
      });
      if (!product) throw new Error();

      if (product.variants.length) {
        const availableQuantity = product.variants.reduce(
          (p, c) => p + c.availableQuantity,
          0,
        );
        await prisma.product.update({
          where: {
            id: pId,
          },
          data: {
            availableQuantity,
          },
        });
      }
    }

    return { paymentUrl };
  });
};

const PlaceOrderIntoDB = async (
  authUser: IAuthUser,
  payload: IPlaceOrderPayload,
) => {
  const cartItems = await prisma.cartItem.findMany({
    where: {
      id: { in: payload.cartItemsId },
      product: { status: ProductStatus.ACTIVE },
    },
    include: {
      product: { include: { images: true } },
      variant: { include: { attributes: true } },
    },
  });

  if (cartItems.length !== payload.cartItemsId.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Item not found in cart");
  }

  const shippingCharge = await prisma.shippingCharge.findUnique({
    where: { id: payload.shippingChargeId },
  });

  if (!shippingCharge) {
    throw new AppError(httpStatus.NOT_FOUND, "Shipping charge not found");
  }

  const shippingAmount = shippingCharge.cost;

  // Map cart items for easier processing
  const items = cartItems.map((item) => {
    const variant = item.variant;
    const price = variant
      ? variant.offerPrice || variant.price
      : item.product.offerPrice || item.product.price;
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

  // **Check stock before reserving**
  for (const item of cartItems) {
    const availableQuantity = item.variant
      ? item.variant.availableQuantity
      : item.product.availableQuantity;
    if (availableQuantity < item.quantity) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `Stock not available: ${item.product.name} (${item.quantity} requested, only ${availableQuantity} left)`,
      );
    }
  }

  // **Calculate subtotal**
  const subTotal = items.reduce((p, c) => p + c.price * c.quantity, 0);
  let discountAmount = 0;

  if (payload.discountCode) {
    const discount = await prisma.discount.findFirst({
      where: { code: payload.discountCode },
    });

    if (!discount)
      throw new AppError(httpStatus.NOT_FOUND, "Discount not found");

    if (discount.minOrderValue && discount.minOrderValue > subTotal) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `Discount not applicable. Min order value: ${discount.minOrderValue}`,
      );
    }

    discountAmount =
      discount.discountType === DiscountType.FIXED
        ? discount.discountValue
        : (discount.discountValue / 100) * subTotal;
  }

  const totalAmount = subTotal;
  const grossAmount = parseFloat((totalAmount - discountAmount).toFixed(2));
  const netAmount = grossAmount + shippingAmount;

  return await prisma.$transaction(async (txClient) => {
    const data = {
      customerId: authUser.customerId!,
      totalAmount,
      discountAmount,
      grossAmount,
      shippingAmount,
      netAmount,
      discountData: { code: payload.discountCode, discountAmount },
      shippingChargeData: {
        id: shippingCharge.id,
        title: shippingCharge.title,
        description: shippingCharge.description,
        cost: shippingCharge.cost,
      },
      notes: payload.notes,
      exceptedDeliveryDate: convertExceptedDeliveryDate(
        shippingCharge.deliveryHours,
      ),
      status: OrderStatus.PLACED,
      deletableCartItemsId: payload.removeCartItemsAfterPurchase
        ? payload.cartItemsId.join(",")
        : null,
    };

    // **Create Order**
    const createdOrder = await txClient.order.create({
      data: data,
    });

    // **Reserve Stock**
    await txClient.itemReserve.createMany({
      data: cartItems.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    });

    // **Create Order Items**
    await txClient.orderItem.createMany({
      data: items.map((item) => ({ orderId: createdOrder.id, ...item })),
    });

    const stockUpdatableVariants = cartItems
      .filter((_) => _.productId && _.variantId)
      .map((_) => ({ id: _.variantId, quantity: _.quantity }));
    const stockUpdatableProducts = cartItems
      .filter((_) => _.productId && !_.variantId)
      .map((_) => ({ id: _.productId, quantity: _.quantity }));

    await Promise.all(
      stockUpdatableVariants.map((variant) =>
        txClient.variant.update({
          where: { id: variant.id! },
          data: { availableQuantity: { decrement: variant.quantity } },
        }),
      ),
    );

    await Promise.all(
      stockUpdatableProducts.map((product) =>
        txClient.product.update({
          where: { id: product.id! },
          data: { availableQuantity: { decrement: product.quantity } },
        }),
      ),
    );
    // **Save Shipping Info**
    // **Save Shipping Info**
    let { address, addressId, ...otherShippingInfo } = payload.shippingInfo;

    if (addressId) {
      const existingAddress = await txClient.customerAddress.findUnique({
        where: { id: addressId },
      });
      if (!existingAddress)
        throw new AppError(httpStatus.NOT_FOUND, "Address not found");

      address = {
        district: existingAddress.district,
        zone: existingAddress.zone,
        line: existingAddress.line,
      };
    }

    const shippingInfo = await txClient.shippingInformation.create({
      data: { orderId: createdOrder.id, ...otherShippingInfo, ...address },
    });

    // **Initialize Payment AFTER successful order creation**
    const { paymentId } = await PaymentServices.initPayment({
      method: PaymentMethod.COD,
      amount: grossAmount,
      customer: {
        name: shippingInfo.fullName,
        email: shippingInfo.emailAddress,
        phone: shippingInfo.phoneNumber,
      },
      shippingAddress: Object.values(address).join(","),
    });

    await txClient.order.update({
      where: { id: createdOrder.id },
      data: { paymentId },
    });

    const productsId = cartItems.map((_) => _.productId);

    for (const pId of productsId) {
      const product = await prisma.product.findUnique({
        where: {
          id: pId,
        },
        select: {
          id: true,
          availableQuantity: true,
          variants: true,
        },
      });
      if (!product) throw new Error();

      if (product.variants.length) {
        const availableQuantity = product.variants.reduce(
          (p, c) => p + c.availableQuantity,
          0,
        );
        await prisma.product.update({
          where: {
            id: pId,
          },
          data: {
            availableQuantity,
          },
        });
      }
    }

    const deletableCartItemsId = createdOrder.deletableCartItemsId;
    // If deletable cart items exist then delete cart items from db
    if (deletableCartItemsId) {
      await txClient.cartItem.deleteMany({
        where: {
          id: {
            in: deletableCartItemsId.split(","),
          },
        },
      });
    }

    return null;
  });
};

const placeOrderAfterSuccessfulPaymentIntoDB = async (
  paymentId: string,
  tx: Prisma.TransactionClient,
) => {
  await tx.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status: PaymentStatus.SUCCESS,
    },
  });
  const updatedOrderData = await tx.order.update({
    where: {
      paymentId: paymentId,
    },
    data: {
      status: OrderStatus.PLACED,
      paymentStatus: OrderPaymentStatus.PAID,
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

const manageUnsuccessfulOrdersIntoDB = async (
  status: "CANCELED" | "FAILED",
  id: number,
  tx: Prisma.TransactionClient,
) => {
  await tx.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  // Retrieve all reserved stock items for the failed order
  const reserves = await tx.itemReserve.findMany({
    where: {
      orderId: id, // Get item reservations related to this order
      status: ItemReserveStatus.RESERVED,
    },
  });

  // Restore stock for non-variant products (simple products)
  await Promise.all(
    reserves
      .filter((item) => item.productId && !item.variantId) // Only products without variants
      .map((item) => {
        return tx.product.updateMany({
          where: {
            id: item.productId!, // Match product by ID
          },
          data: {
            availableQuantity: {
              increment: item.quantity, // Restore reserved quantity
            },
          },
        });
      }),
  );

  // Restore stock for variant products
  await Promise.all(
    reserves
      .filter((item) => item.productId && item.variantId) // Only products with variants
      .map((item) => {
        return tx.variant.updateMany({
          where: {
            id: item.variantId!, // Match variant by ID
          },
          data: {
            availableQuantity: {
              increment: item.quantity, // Restore reserved quantity
            },
          },
        });
      }),
  );

  // Update reserve status
  await tx.itemReserve.updateMany({
    where: {
      orderId: id,
    },
    data: {
      status: ItemReserveStatus.RESTORED,
    },
  });
  const payment = await tx.payment.findFirst({
    where: {
      order: {
        id,
      },
    },
  });
  const productsId = reserves.map((_) => _.productId!);

  for (const pId of productsId) {
    const product = await prisma.product.findUnique({
      where: {
        id: pId,
      },
      select: {
        id: true,
        availableQuantity: true,
        variants: true,
      },
    });
    if (!product) throw new Error();

    if (product.variants.length) {
      const availableQuantity = product.variants.reduce(
        (p, c) => p + c.availableQuantity,
        0,
      );
      await prisma.product.update({
        where: {
          id: pId,
        },
        data: {
          availableQuantity,
        },
      });
    }
  }

  if (payment && payment.status === PaymentStatus.SUCCESS) {
    await tx.paymentRefundRequest.create({
      data: {
        paymentId: payment.id,
      },
    });
  }
};

const updateOrderStatusIntoDB = async (
  authUser: IAuthUser,
  payload: IUpdateOrderStatusPayload,
) => {
  const order = await prisma.order.findUnique({
    where: {
      id: payload.orderId,
    },
    include: {
      customer: true,
    },
  });
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  // If status and isNext is not exist in payload then throw error
  if (!payload.status && payload.isNext === undefined) {
    throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
  } else if (
    [
      OrderStatus.PENDING,
      OrderStatus.FAILED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELED,
    ].includes(order.status as any)
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Order status update can not possible",
    );
  }

  const nextStatus = {
    [OrderStatus.PLACED]: OrderStatus.PROCESSING,
    [OrderStatus.PROCESSING]: OrderStatus.IN_TRANSIT,
    [OrderStatus.IN_TRANSIT]: OrderStatus.DELIVERED,
  };
  //  If is next option is true then go to next order status
  if (payload.isNext) {
    const currentStatus = order.status;
    payload.status = (nextStatus as any)[currentStatus];
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.order.update({
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

    if (
      [OrderStatus.CANCELED, OrderStatus.FAILED].includes(payload.status as any)
    ) {
      await manageUnsuccessfulOrdersIntoDB(
        payload.status as any,
        payload.orderId,
        tx,
      );
    }
    await tx.administratorActivityLog.create({
      data: {
        administratorId: authUser.administratorId!,
        action: `Updated the order status ${order.status} to ${payload.status} orderId:${order.id}`,
      },
    });
  });
  await NotificationServices.createNotificationIntoDB({
    usersId: [order.customer.userId],
    ...getOrderStatusMessage(payload.status),
    type: "ALERT",
  });

  return result;
};

const cancelMyOrderIntoDB = async (
  authUser: IAuthUser,
  id: string | number,
) => {
  id = Number(id);
  const order = await prisma.order.findUnique({
    where: {
      id,
      customerId: authUser.customerId,
    },
    select: {
      id: true,
      status: true,
      itemReserve: true,
    },
  });
  if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  if (order.status !== OrderStatus.PLACED) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Sorry order can not be possible ",
    );
  }

  await prisma.$transaction(async (tx) => {
    await manageUnsuccessfulOrdersIntoDB("CANCELED", id, tx);
    await tx.notification.create({
      data: {
        userId: authUser.id!,
        title: `You have canceled your order ID:${id}`,
        message:
          "Your order has been successfully canceled. If this was a mistake or you need assistance, please contact our support team.",
        type: "ORDER_STATUS",
      },
    });
  });
};

const getOrdersForManageFromDB = async (
  filter: IMyOrderFilterQuery,
  paginationOptions: IPaginationOptions,
) => {
  const { startDate, endDate, status, customerId, orderId } = filter;
  const { skip, limit, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.OrderWhereInput[] = [];

  if (orderId && !Number.isNaN(orderId)) {
    andConditions.push({
      id: Number(orderId),
    });
  } else {
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
    if (customerId && !Number.isNaN(customerId)) {
      andConditions.push({
        customerId: Number(customerId),
      });
    }
  }

  const whereConditions: Prisma.OrderWhereInput = {
    status: {
      not: {
        in: [OrderStatus.PENDING, OrderStatus.FAILED],
      },
    },
    AND: andConditions,
  };

  const data = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    select: {
      id: true,
      customer: {
        select: {
          id: true,
          userId: true,
          fullName: true,
          profilePhoto: true,
        },
      },
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
      payment: true,
    },
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const totalResult = await prisma.order.count({
    where: whereConditions,
  });

  const total = await prisma.order.count({
    where: {
      status: {
        not: {
          in: [OrderStatus.PENDING, OrderStatus.FAILED],
        },
      },
    },
  });

  const meta = {
    limit,
    page,
    totalResult,
    total,
  };
  return {
    data,
    meta,
  };
};
const getMyOrdersFromDB = async (
  authUser: IAuthUser,
  filter: IMyOrderFilterQuery,
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
      not: {
        in: [OrderStatus.PENDING, OrderStatus.FAILED],
      },
    },
    AND: andConditions,
  };
  console.log(orderBy, sortOrder);
  const orders = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    select: {
      id: true,
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
      payment: true,
    },
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const data = orders.map((order) => {
    const { gatewayGatewayData, ...otherPData } = order.payment as any;
    return {
      ...order,
      payment: otherPData,
    };
  });

  const totalResult = await prisma.order.count({
    where: whereConditions,
  });

  const total = await prisma.order.count({
    where: {
      status: {
        not: {
          in: [OrderStatus.PENDING, OrderStatus.FAILED],
        },
      },
      customerId: authUser.customerId,
    },
  });

  const meta = {
    limit,
    page,
    totalResult,
    total,
  };
  return {
    data,
    meta,
  };
};

const getMyOrderByIdFromDB = async (
  authUser: IAuthUser,
  id: string | number,
) => {
  id = Number(id);
  const order = await prisma.order.findUnique({
    where: {
      id,
      status: {
        not: {
          in: [OrderStatus.PENDING, OrderStatus.FAILED],
        },
      },
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
      notes: true,
      exceptedDeliveryDate: true,
      status: true,
      paymentStatus: true,
      payment: true,
      createdAt: true,
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

const getOrderByIdForManageFromDB = async (id: string | number) => {
  id = Number(id);
  const order = await prisma.order.findUnique({
    where: {
      id,
      status: {
        not: {
          in: [OrderStatus.PENDING, OrderStatus.FAILED],
        },
      },
    },
    select: {
      id: true,
      customer: {
        select: {
          id: true,
          userId: true,
          fullName: true,
          profilePhoto: true,
        },
      },
      items: true,
      totalAmount: true,
      discountAmount: true,
      grossAmount: true,
      shippingAmount: true,
      netAmount: true,
      shippingChargeData: true,
      shippingInfo: true,
      notes: true,
      exceptedDeliveryDate: true,
      status: true,
      paymentStatus: true,
      payment: true,
      createdAt: true,
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

const getRecentOrdersFromDB = async () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 2);
  const endDate = new Date();

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      customer: {
        select: {
          id: true,
          fullName: true,
          profilePhoto: true,
        },
      },
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
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};

const getNotReviewedOrderItemsFromDB = async (
  authUser: IAuthUser,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, page } = calculatePagination(paginationOptions);
  const data = await prisma.orderItem.findMany({
    where: {
      order: {
        customerId: authUser.customerId,
        status: OrderStatus.DELIVERED,
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
  const whereConditions = {
    OR: [
      {
        availableQuantity: 0,
      },
      {
        variants: {
          some: {
            availableQuantity: 0,
          },
        },
      },
    ],
  };
  const { skip, limit, page } = calculatePagination(paginationOptions);
  const products = await prisma.product.findMany({
    where: whereConditions,
    include: {
      variants: {
        where: {
          availableQuantity: 0,
        },
      },
    },
    skip,
    take: limit,
  });

  const data = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      offerPrice: product.price,
      variants: product.variants,
    };
  });

  const totalResult = prisma.product.count({ where: whereConditions });
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

const OrderServices = {
  initOrderIntoDB,
  placeOrderAfterSuccessfulPaymentIntoDB,
  PlaceOrderIntoDB,
  manageUnsuccessfulOrdersIntoDB,
  getMyOrdersFromDB,
  getOrdersForManageFromDB,
  getStockOutProductsFromDB,
  getOrderByIdForManageFromDB,
  getMyOrderByIdFromDB,
  getNotReviewedOrderItemsFromDB,
  cancelMyOrderIntoDB,
  updateOrderStatusIntoDB,
  getRecentOrdersFromDB,
};

export default OrderServices;

import {
  DiscountStatus,
  OrderStatus,
  PaymentStatus,
  Prisma,
  ProductStatus,
} from "@prisma/client";
import prisma from "../../shared/prisma";

const getAllOverviewDataFromDB = async () => {
  const userWhereConditions: Prisma.UserWhereInput = {
    status: {
      not: "Deleted",
    },
  };
  const totalUsers = await prisma.user.count({
    where: userWhereConditions,
  });
  const totalOrders = await prisma.order.count({
    where: {
      status: {
        not: "Pending",
      },
    },
  });
  const totalReviews = await prisma.productReview.count();
  const totalCustomers = await prisma.customer.count({
    where: {
      user: userWhereConditions,
    },
  });
  const totalStaffs = await prisma.staff.count({
    where: {
      user: userWhereConditions,
    },
  });
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });

  const totalBrands = await prisma.brand.count();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 2);
  const endDate = new Date();

  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
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

  const recentPayments = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    totalUsers,
    totalCustomers,
    totalStaffs,
    totalBrands,
    totalOrders,
    totalReviews,
    totalRevenue,
    recentOrders,
    recentPayments,
  };
};

const getUsersOverviewFromDB = async () => {
  const userWhereConditions: Prisma.UserWhereInput = {
    status: {
      not: "Deleted",
    },
  };
  const total = await prisma.user.count({
    where: userWhereConditions,
  });

  const totalActive = await prisma.user.count({
    where: {
      status: "Active",
    },
  });

  const totalSuspended = await prisma.user.count({
    where: {
      status: "Suspended",
    },
  });

  const totalDeleted = await prisma.user.count({
    where: {
      status: "Deleted",
    },
  });

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 2);
  const endDate = new Date();

  const totalRecentlyJoined = await prisma.user.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return {
    total,
    totalActive,
    totalSuspended,
    totalDeleted,
    totalRecentlyJoined,
  };
};

const getOrdersOverviewFromDB = async () => {
  const total = await prisma.order.count({
    where: {
      status: {
        not: OrderStatus.Pending,
      },
    },
  });

  const totalPlaced = await prisma.order.count({
    where: {
      status: OrderStatus.Placed,
    },
  });

  const totalProcessing = await prisma.order.count({
    where: {
      status: OrderStatus.Processing,
    },
  });

  const totalInTransit = await prisma.order.count({
    where: {
      status: OrderStatus.InTransit,
    },
  });

  const totalOutForDelivery = await prisma.order.count({
    where: {
      status: OrderStatus.OutForDelivery,
    },
  });

  const totalDelivered = await prisma.order.count({
    where: {
      status: OrderStatus.Delivered,
    },
  });

  const totalCanceled = await prisma.order.count({
    where: {
      status: OrderStatus.Canceled,
    },
  });

  const totalReturned = await prisma.order.count({
    where: {
      status: OrderStatus.Returned,
    },
  });

  const totalYetToDelivery = await prisma.order.count({
    where: {
      status: {
        in: [
          OrderStatus.Processing,
          OrderStatus.InTransit,
          OrderStatus.OutForDelivery,
        ],
      },
    },
  });

  const totalRunningOrder = await prisma.order.count({
    where: {
      status: {
        in: [
          OrderStatus.Placed,
          OrderStatus.Processing,
          OrderStatus.InTransit,
          OrderStatus.OutForDelivery,
        ],
      },
    },
  });

  return {
    total,
    totalPlaced,
    totalProcessing,
    totalInTransit,
    totalOutForDelivery,
    totalDelivered,
    totalReturned,
    totalCanceled,
    totalYetToDelivery,
    totalRunningOrder,
  };
};

const getProductsOverviewFromDB = async () => {
  const whereConditions = {
    status: {
      not: ProductStatus.Deleted,
    },
  };
  const total = await prisma.product.count({
    where: whereConditions,
  });

  const totalActive = await prisma.product.count({
    where: {
      status: ProductStatus.Active,
    },
  });

  const totalInActive = await prisma.product.count({
    where: {
      status: ProductStatus.InActive,
    },
  });

  const totalStockOut = await prisma.product.count({
    where: {
      OR: [
        {
          stock: 0,
        },
        {
          variants: {
            some: {
              stock: 0,
            },
          },
        },
      ],
      status: {
        not: ProductStatus.Deleted,
      },
    },
  });

  //    const bestSellingProducts = await prisma.product.findMany({

  //    }).

  return {
    total,
    totalActive,
    totalInActive,
    totalStockOut,
  };
};

const getDiscountOverviewFromDB = async () => {
  const total = await prisma.discount.count();
  const totalActive = await prisma.discount.count({
    where: {
      status: DiscountStatus.Active,
    },
  });
  const totalInActive = await prisma.discount.count({
    where: {
      status: DiscountStatus.InActive,
    },
  });

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 2);
  const endDate = new Date();

  const totalRecentlyAdded = await prisma.discount.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return {
    total,
    totalActive,
    totalInActive,
    totalRecentlyAdded,
  };
};

const getPaymentsOverviewFromDB = async () => {
  const total = await prisma.payment.count({
    where: {
      status: PaymentStatus.Successful,
    },
  });

  const totalAmount = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 2);
  const endDate = new Date();

  const totalRecentPayment = await prisma.payment.count({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const totalAmountRecentPayment = await prisma.payment.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    total,
    totalAmount,
    totalRecentPayment,
    totalAmountRecentPayment,
  };
};

const OverviewServices = {
  getAllOverviewDataFromDB,
  getUsersOverviewFromDB,
  getOrdersOverviewFromDB,
  getDiscountOverviewFromDB,
  getProductsOverviewFromDB,
  getPaymentsOverviewFromDB,
};

export default OverviewServices;

import {
  DiscountStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  ProductStatus,
  UserStatus,
} from "@prisma/client";
import prisma from "../../shared/prisma";
import { IAuthUser } from "../Auth/auth.interface";

const getAllOverviewDataFromDB = async () => {
  const userWhereConditions: Prisma.UserWhereInput = {
    status: {
      not: UserStatus.DELETED,
    },
  };
  const totalUsers = await prisma.user.count({
    where: userWhereConditions,
  });
  const totalOrders = await prisma.order.count({
    where: {
      status: {
        not: {
          in: [OrderStatus.PENDING, OrderStatus.FAILED],
        },
      },
    },
  });
  const totalReviews = await prisma.productReview.count();
  const totalCustomers = await prisma.customer.count({
    where: {
      user: userWhereConditions,
    },
  });
  const totalAdministrators = await prisma.administrator.count({
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

  return {
    totalUsers,
    totalCustomers,
    totalAdministrators,
    totalBrands,
    totalOrders,
    totalReviews,
    totalRevenue,
  };
};

const getUsersOverviewFromDB = async () => {
  const userWhereConditions: Prisma.UserWhereInput = {
    status: {
      not: UserStatus.DELETED,
    },
  };
  const total = await prisma.user.count({
    where: userWhereConditions,
  });

  const totalActive = await prisma.user.count({
    where: {
      status: UserStatus.ACTIVE,
    },
  });

  const totalBlocked = await prisma.user.count({
    where: {
      status: UserStatus.BLOCKED,
    },
  });

  const totalDeleted = await prisma.user.count({
    where: {
      status: UserStatus.DELETED,
    },
  });

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 2);
  const endDate = new Date();

  return {
    total,
    totalActive,
    totalBlocked,
    totalDeleted,
  };
};

const getOrdersOverviewFromDB = async () => {
  const total = await prisma.order.count();

  const group = await prisma.order.groupBy({
    by: "status",
    _count: true,
  });

  const totalPlaced =
    group.find((_) => _.status === OrderStatus.PLACED)?._count || 0;
  const totalProcessing =
    group.find((_) => _.status === OrderStatus.PROCESSING)?._count || 0;

  const totalInTransit =
    group.find((_) => _.status === OrderStatus.IN_TRANSIT)?._count || 0;

  const totalDelivered =
    group.find((_) => _.status === OrderStatus.DELIVERED)?._count || 0;
  const totalFailed =
    group.find((_) => _.status === OrderStatus.FAILED)?._count || 0;

  const totalCanceled =
    group.find((_) => _.status === OrderStatus.CANCELED)?._count || 0;

  const totalReturned =
    group.find((_) => _.status === OrderStatus.RETURNED)?._count || 0;

  return {
    total,
    totalPlaced,
    totalProcessing,
    totalInTransit,
    totalDelivered,
    totalReturned,
    totalCanceled,
    totalFailed,
  };
};

const getProductsOverviewFromDB = async () => {
  const whereConditions = {
    status: {
      not: ProductStatus.DELETED,
    },
  };
  const total = await prisma.product.count({
    where: whereConditions,
  });

  const totalActive = await prisma.product.count({
    where: {
      status: ProductStatus.ACTIVE,
    },
  });

  const totalPaused = await prisma.product.count({
    where: {
      status: ProductStatus.PAUSED,
    },
  });

  const totalStockOut = await prisma.product.count({
    where: {
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
      status: {
        not: ProductStatus.DELETED,
      },
    },
  });

  return {
    total,
    totalActive,
    totalPaused,
    totalStockOut,
  };
};

const getDiscountOverviewFromDB = async () => {
  const total = await prisma.discount.count();
  const totalActive = await prisma.discount.count({
    where: {
      status: DiscountStatus.ACTIVE,
    },
  });
  const totalPaused = await prisma.discount.count({
    where: {
      status: DiscountStatus.INACTIVE,
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
    totalPaused,
    totalRecentlyAdded,
  };
};

const getPaymentsOverviewFromDB = async () => {
  const total = await prisma.payment.count({
    where: {
      status: PaymentStatus.SUCCESS,
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

const getMyOverviewDataFromDB = async (authUser:IAuthUser)=>{
 const ordersTotal = await prisma.order.count({
  where:{
    customerId:authUser.customerId!,
    OR:[
      {
        payment:{
          method:PaymentMethod.COD
        }
      },
      {
        payment:{
          method:{
            not:PaymentMethod.COD
          },
          
        },
        paymentStatus:'PAID'
      }
    ],
    status:{
      notIn:[OrderStatus.PENDING,OrderStatus.CANCELED]
    }
  }
 })
 const notReviewedTotal =  await prisma.orderItem.count({
  where:{
    order:{
      customerId:authUser.customerId,
      status:OrderStatus.DELIVERED
    },
    
    isReviewed:false
  }
 })

 const unreadNotificationsTotal =  await prisma.notification.count({
  where:{
    userId:authUser.id,
    isRead:false
  }
 })

 const reviewsTotal = await prisma.productReview.count({
  where:{
    customerId:authUser.customerId
  }
 })

 return {
  ordersTotal,
  notReviewedTotal,
  reviewsTotal,
  unreadNotificationsTotal
 }
}

const OverviewServices = {
  getAllOverviewDataFromDB,
  getUsersOverviewFromDB,
  getOrdersOverviewFromDB,
  getDiscountOverviewFromDB,
  getProductsOverviewFromDB,
  getPaymentsOverviewFromDB,
  getMyOverviewDataFromDB
};

export default OverviewServices;

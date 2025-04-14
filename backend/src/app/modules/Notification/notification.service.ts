import { Prisma, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import {
  ICreateNotificationPayload,
  IFilterNotifications,
} from "./notification.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IAuthUser } from "../Auth/auth.interface";

const createNotificationIntoDB = async (
  payload: ICreateNotificationPayload,
) => {
  await prisma.$transaction(async (txClient) => {
    const { usersId } = payload;
    if (payload.usersId && payload.usersId.length) {
      for (let i = 0; i < usersId.length; i++) {
        await txClient.notification.create({
          data: {
            userId: usersId[i],
            type: payload.type,
            title: payload.title,
            message: payload.message,
            imageUrl: payload.imageUrl,
          },
        });
      }
    } else {
      const users = await prisma.user.findMany({
        where: {
          role: UserRole.CUSTOMER,
          status: UserStatus.ACTIVE,
        },
        select: {
          id: true,
        },
      });
      await Promise.all(
        users.map((user) => {
          return txClient.notification.create({
            data: {
              userId: user.id,
              type: payload.type,
              title: payload.title,
              message: payload.message,
              imageUrl: payload.imageUrl,
            },
          });
        }),
      );
    }
  });
};

const getNotificationsFromDB = async (
  filter: IFilterNotifications,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, page, orderBy, sortOrder } =
    calculatePagination(paginationOptions);

  const { userId, type, startDate, endDate } = filter;
  const andConditions: Prisma.NotificationWhereInput[] = [];
  if (userId) {
    andConditions.push({
      userId: Number(userId),
    });
  }
  if (type) {
    andConditions.push({
      type,
    });
  }
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
    } else if (startDate && !isNaN(new Date(startDate).getTime())) {
      andConditions.push({
        createdAt: {
          gte: new Date(startDate),
        },
      });
    } else if (endDate && !isNaN(new Date(endDate).getTime())) {
      andConditions.push({
        createdAt: {
          lte: new Date(endDate),
        },
      });
    }
  }

  const whereConditions: Prisma.NotificationWhereInput = {
    AND: andConditions,
  };

  const data = await prisma.notification.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const total = await prisma.notification.count({
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

const  getMyNotificationsFromDB = async (
  authUser: IAuthUser,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, page, orderBy, sortOrder } =
    calculatePagination(paginationOptions);

  const data = await prisma.notification.findMany({
    where: {
      userId: authUser.id,
    },
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const totalResult = await prisma.notification.count({
    where: {
      userId: authUser.id,
    },
  });
  const meta = {
    limit,
    page,
    totalResult,
  };
  return {
    data,
    meta,
  };
};

const notificationsSetAsReadIntoDB = async (authUser: IAuthUser) => {
  await prisma.notification.updateMany({
    where: {
      userId: authUser.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
  return null;
};

const NotificationServices = {
  createNotificationIntoDB,
  getNotificationsFromDB,
  getMyNotificationsFromDB,
  notificationsSetAsReadIntoDB,
};

export default NotificationServices;

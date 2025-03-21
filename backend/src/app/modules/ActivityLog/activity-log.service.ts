import { Prisma } from "@prisma/client";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IFilterActivityLogs } from "./activity-log.interface";
import prisma from "../../shared/prisma";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";

const getActivityLogsFromDB = async (
  filter: IFilterActivityLogs,
  paginationOptions: IPaginationOptions,
) => {
  const { staffId, startDate, endDate } = filter;
  const { skip, limit, page, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.ActivityLogWhereInput[] = [];

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

  if (staffId) {
    andConditions.push({
      staffId,
    });
  }

  const whereConditions = {
    AND: andConditions,
  };
  const data = await prisma.activityLog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      createdAt: sortOrder as "asc" | "desc",
    },
  });

  const total = await prisma.activityLog.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit,
    total,
  };

  return {
    data,
    meta,
  };
};

const deleteActivityFromDB = async (id: string) => {
  const activity = await prisma.activityLog.findUnique({
    where: {
      id,
    },
  });

  if (!activity) {
    throw new AppError(httpStatus.NOT_FOUND, "Activity not found");
  }
  await prisma.activityLog.delete({
    where: {
      id,
    },
  });
  return null;
};

const ActivityLogServices = {
  getActivityLogsFromDB,
  deleteActivityFromDB,
};

export default ActivityLogServices;

import { Coupon } from "@prisma/client";
import prisma from "../../shared/prisma";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";

const createCouponIntoDB = async (payload: Coupon) => {
  const coupon = await prisma.coupon.findUnique({
    where: {
      code: payload.code,
    },
  });

  if (coupon) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Coupon already exist on this code",
    );
  }

  return await prisma.coupon.create({
    data: payload,
  });
};

const CouponServices = {
  createCouponIntoDB,
};

export default CouponServices;

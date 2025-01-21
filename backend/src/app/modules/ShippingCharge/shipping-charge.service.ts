import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import {
  ICreateShippingChargePayload,
  IUpdateShippingChargePayload,
} from "./shipping-charge.interface";

const createShippingChargeIntoDB = async (
  payload: ICreateShippingChargePayload,
) => {
  return await prisma.shippingCharge.create({
    data: payload,
  });
};

const getShippingChargesFromDB = async () => {
  return await prisma.shippingCharge.findMany();
};

const updateShippingChargeIntoDB = async (
  shippingChargeId: string,
  payload: IUpdateShippingChargePayload,
) => {
  const shippingCharge = await prisma.shippingCharge.findUnique({
    where: {
      id: shippingChargeId,
    },
  });

  if (!shippingCharge) {
    throw new AppError(httpStatus.NOT_FOUND, "Shipping charge not found");
  }

  return await prisma.shippingCharge.update({
    where: {
      id: shippingChargeId,
    },
    data: payload,
  });
};

const deleteShippingChargeByIdFromDB = async (id: string) => {
  const shippingCharge = await prisma.shippingCharge.findUnique({
    where: {
      id,
    },
  });

  if (!shippingCharge) {
    throw new AppError(httpStatus.NOT_FOUND, "Shipping charge not found");
  }

  await prisma.shippingCharge.delete({
    where: {
      id,
    },
  });
};

const ShippingChargeServices = {
  createShippingChargeIntoDB,
  getShippingChargesFromDB,
  updateShippingChargeIntoDB,
  deleteShippingChargeByIdFromDB,
};

export default ShippingChargeServices;

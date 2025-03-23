import { Prisma } from "@prisma/client";
import AppError from "../../Errors/AppError";
import { IPaginationOptions } from "../../interfaces/pagination";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import {
  ICreateShippingChargePayload,
  IShippingChargesFilterQuery,
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

const getShippingChargesForManageFromDB = async (
  filterQuery: IShippingChargesFilterQuery,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, deliveryHours } = filterQuery;
  const whereConditions: Prisma.ShippingChargeWhereInput = {};

  //  if(!Number.isNaN(searchTerm)){
  //    whereConditions.id = Number(searchTerm) as number
  //  }
};

const updateShippingChargeIntoDB = async (
  shippingChargeId: string,
  payload: IUpdateShippingChargePayload,
) => {
  // Find the existing shipping charge by ID
  const shippingCharge = await prisma.shippingCharge.findUnique({
    where: {
      id: shippingChargeId,
    },
  });

  // If the shipping charge does not exist, throw a "Not Found" error
  if (!shippingCharge) {
    throw new AppError(httpStatus.NOT_FOUND, "Shipping charge not found");
  }

  // Update the shipping charge with the new payload and return the updated record
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

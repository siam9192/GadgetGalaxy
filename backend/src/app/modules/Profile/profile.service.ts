import prisma from "../../shared/prisma";
import { UserRole } from "@prisma/client";
import ProfileValidations from "./profile.validation";
import { IAuthUser } from "../Auth/auth.interface";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import {
  IUpdateCustomerProfilePayload,
  IUpdateAdministratorProfilePayload,
} from "./profile.interface";

const updateMyProfileIntoDB = async (authUser: IAuthUser, payload: any) => {
  // Check user existence
  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  let result;

  if (user.role === UserRole.CUSTOMER) {
    const data = payload as IUpdateCustomerProfilePayload;
    ProfileValidations.UpdateCustomerProfileValidation.parse(data);

    result = await prisma.$transaction(async (txClient) => {
      const { addresses, ...othersData } = data;

      if(othersData.dateOfBirth){
        othersData.dateOfBirth = new Date(othersData.dateOfBirth)
      }

      await txClient.customer.update({
        where: {
          id: authUser.customerId,
        },
        data: othersData,
      });

      // Update addresses
      if (addresses && addresses.length) {
        const deletedAddresses = addresses?.filter((_) => _.id && _.isDeleted);
        const newAddedAddresses = addresses?.filter(
          (_) => !_.id && !_.isDeleted,
        );
        const updatedAddresses = addresses.filter((_) => _.id && !_.isDeleted);
        if (deletedAddresses.length) {
          await txClient.customerAddress.deleteMany({
            where: {
              id: {
                in: deletedAddresses.map((_) => _.id),
              },
            },
          });
        }

        if (newAddedAddresses.length) {
          await txClient.customerAddress.createMany({
            data: newAddedAddresses.map((address) => ({
              customerId: authUser.customerId!,
              district: address.district,
              zone: address.zone,
              line: address.line,
              isDefault: address.isDefault || false,
            })),
          });
        }

        if (updatedAddresses.length) {
          await Promise.all(
            updatedAddresses.map((address) =>
              txClient.customerAddress.updateMany({
                where: {
                  id: address.id!,
                },
                data: {
                  district: address.district,
                  zone: address.zone,
                  line: address.line,
                  isDefault: address.isDefault || false,
                },
              }),
            ),
          );
        }
      }

      return await txClient.customer.findUnique({
        where: {
          id: authUser.customerId!,
        },
        include: {
          addresses: true,
        },
      });
    });
  }
  // Update administrator
  else {
    const data = payload as IUpdateAdministratorProfilePayload;
    ProfileValidations.UpdateAdministratorProfileValidation.parse(data);
    result = await prisma.administrator.update({
      where: {
        id: authUser.administratorId,
      },
      data,
    });
  }
  return result;
};

const ProfileServices = {
  updateMyProfileIntoDB,
};

export default ProfileServices;

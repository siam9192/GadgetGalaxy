import prisma from "../../shared/prisma";
import { UserRole } from "@prisma/client";
import ProfileValidations from "./profile.validation";
import { IAuthUser } from "../Auth/auth.interface";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import {
  IUpdateCustomerProfilePayload,
  IUpdateStaffProfilePayload,
} from "./profile.interface";

const getUserProfileByIdFromDB = async (id: string) => {
  // Get user if user not exist then throw user not found error
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      customer: {
        include: {
          _count: {
            select: {
              orders: {
                where: {
                  status: {
                    not: "Pending",
                  },
                },
              },
              productReviews: true,
            },
          },
        },
      },
      staff: true,
      account: true,
    },
  });

  const userRole = user.role;
  let result;
  if (userRole === UserRole.Customer) {
    const profile = user.customer;
    if (profile) {
      result = {
        email: user.account?.email,
        role: user.role,
        fullName: profile.fullName,
        profilePhoto: profile.profilePhoto,
        status: user.status,
        join_date: user.createdAt,
      };
    }
  } else {
    const profile = user.staff;
    if (profile) {
      result = {
        email: user.account?.email,
        role: user.role,
        fullName: profile.fullName,
        profilePhoto: profile.profilePhoto,
        gender: profile.gender,
        status: user.status,
        lastLoginAt: user.lastLoginAt,
        joinDate: user.createdAt,
      };
    }
  }

  return result;
};

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

  if (user.role === UserRole.Customer) {
    const data = payload as IUpdateCustomerProfilePayload;
    ProfileValidations.UpdateCustomerProfileValidation.parse(data);

    result = await prisma.$transaction(async (txClient) => {
      const {
        updatedAddresses,
        newAddedAddresses,
        deletedAddressesIds,
        ...othersData
      } = data;

      await txClient.customer.update({
        where: {
          id: authUser.customerId,
        },
        data: othersData,
      });

      if (updatedAddresses && updatedAddresses.length) {
        for (let i = 0; i < updatedAddresses.length; i++) {
          const { id, ...othersData } = updatedAddresses[i];
          await txClient.address.update({
            where: {
              id,
            },
            data: othersData,
          });
        }
      }

      if (deletedAddressesIds && deletedAddressesIds.length) {
        await txClient.address.deleteMany({
          where: {
            id: {
              in: deletedAddressesIds,
            },
          },
        });
      }

      if (newAddedAddresses && newAddedAddresses.length) {
        await txClient.address.createMany({
          data: newAddedAddresses.map((ele) => ({
            customerId: authUser.customerId!,
            ...ele,
          })),
        });
      }
      return await txClient.customer.findUnique({
        where: {
          id: authUser.customerId!,
        },
      });
    });
  }

  // Update staff data
  else {
    const data = payload as IUpdateStaffProfilePayload;
    ProfileValidations.UpdateStaffProfileValidation.parse(data);
    result = await prisma.staff.update({
      where: {
        id: authUser.staffId,
      },
      data,
    });
  }
  return result;
};

const ProfileServices = {
  getUserProfileByIdFromDB,
  updateMyProfileIntoDB,
};

export default ProfileServices;

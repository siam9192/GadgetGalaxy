import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import UserServices from "./user.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.ChangeUserStatusIntoDB(req.user, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "User status changed successfully",
    data: result,
  });
});

const getCustomers = catchAsync(async (req: Request, res: Response) => {
  const filters = Pick(req.query, ["searchTerm", "status"]);
  const options = Pick(req.query, paginationOptionKeys);
  const result = await UserServices.getCustomersFromDB(filters, options as any);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Customers retrieved successfully",
    ...result,
  });
});

const getAdministrators = catchAsync(async (req: Request, res: Response) => {
  const filters = Pick(req.query, ["searchTerm", "status", "role"]);
  const options = Pick(req.query, paginationOptionKeys);
  const result = await UserServices.getAdministratorsFromDB(
    filters,
    options as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Administrators retrieved successfully",
    ...result,
  });
});

const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.softDeleteUserByIdIntoDB(
    req.user,
    req.params.userId,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: result,
  });
});

const createAdministrator = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdministratorIntoDB(
    req.user,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Administrator created successfully",
    data: result,
  });
});

const UserControllers = {
  changeUserStatus,
  getCustomers,
  getAdministrators,
  softDeleteUser,
  createAdministrator,
};

export default UserControllers;

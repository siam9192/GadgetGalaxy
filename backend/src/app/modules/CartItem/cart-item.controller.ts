import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import CartItemServices from "./cart-item.service";

const createCartItem = catchAsync(async (req: Request, res: Response) => {
  const result = await CartItemServices.createCartItemIntoDB(
    req.user,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Item inserted into cart successfully",
    data: result,
  });
});

const getMyCartItems = catchAsync(async (req: Request, res: Response) => {
  const result = await CartItemServices.getMyCartItemsFromDB(req.user);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Cart items retrieved successfully",
    data: result,
  });
});

const changeItemQuantity = catchAsync(async (req: Request, res: Response) => {
  const result = await CartItemServices.changeItemQuantity(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Item quantity changed successfully",
    data: result,
  });
});

const deleteCartItemFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await CartItemServices.deleteCartItemFromDB(
    req.user,
    req.params.id,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Cart items deleted successfully",
    data: result,
  });
});

const CartItemControllers = {
  createCartItem,
  getMyCartItems,
  deleteCartItemFromDB,
  changeItemQuantity,
};

export default CartItemControllers;

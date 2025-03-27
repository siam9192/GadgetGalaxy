import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";
import WishListItemServices from "./wishListItem.service";

const createWishListItem = catchAsync(async (req: Request, res: Response) => {
  const result = await WishListItemServices.createWishListItemIntoDB(
    req.user,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Product successfully added to wishlist",
    data: result,
  });
});

const deleteWishListItem = catchAsync(async (req: Request, res: Response) => {
  const result = await WishListItemServices.deleteWishListItemFromDB(
    req.user,
    req.params.productId,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Product removed  from wishlist",
    data: result,
  });
});

const getMyWishListItems = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await WishListItemServices.getWishListItemsFromDB(
    req.user,
    paginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Wishlist products retrieved successfully",
    ...result,
  });
});

const WishListItemControllers = {
  createWishListItem,
  deleteWishListItem,
  getMyWishListItems,
};

export default WishListItemControllers;

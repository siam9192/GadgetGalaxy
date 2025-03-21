import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/response";
import httpStatus from "../../shared/http-status";
import ProductServices from "./product.service";
import Pick from "../../utils/pick";
import { paginationOptionKeys } from "../../utils/constant";
import { IPaginationOptions } from "../../interfaces/pagination";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.createProductIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Product created successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.updateProductIntoDB(
    req.params.id,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.deleteProductFromDB(
    req.params.productId,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product deleted successfully",
    data: result,
  });
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const filterData = Pick(req.query, [
    "searchTerm",
    "categories",
    "brands",
    "minPrice",
    "maxPrice",
  ]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);

  const result = await ProductServices.getProductsFromDB(
    filterData,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product retrieved successfully",
    ...result,
  });
});
const getSearchProducts = catchAsync(async (req: Request, res: Response) => {
  const filterQuery = Pick(req.query, [
    "searchTerm",
    "category",
    "brand",
    "minPrice",
    "maxPrice",
  ]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);

  const result = await ProductServices.getSearchProductsFromDB(
    filterQuery,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Products retrieved successfully",
    ...result,
  });
});

const getRecentlyViewedProducts = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductServices.getRecentlyViewedProductsFromDB(
      req.user,
      req.params.ids,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Recently viewed products retrieved successfully",
      data: result,
    });
  },
);

const getProductBySlugForCustomerView = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductServices.getProductBySlugForCustomerViewFromDB(
      req.user,
      req.params.slug,
    );

    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Product retrieved successfully",
      data: result,
    });
  },
);

const getMyProducts = catchAsync(async (req: Request, res: Response) => {
  const filterData = Pick(req.query, [
    "searchTerm",
    "categories",
    "minPrice",
    "maxPrice",
  ]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);

  const result = await ProductServices.getMyProductsFromDB(
    req.user,
    filterData,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product retrieved successfully",
    ...result,
  });
});

const getRelatedProductsByProductSlug = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductServices.getRelatedProductsByProductSlugFromDB(
      req.params.productSlug,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Related Products retrieved successfully",
      data: result,
    });
  },
);

const getFeaturedProducts = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await ProductServices.getFeaturedProductsFromDB(
    paginationOptions as IPaginationOptions,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Featured Products retrieved successfully",
    ...result,
  });
});

const getRecommendedProducts = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductServices.getRecommendedProductsFromDB(req.user);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Product retrieved successfully",
      data: result,
    });
  },
);

const getProductsForManage = catchAsync(async (req: Request, res: Response) => {
  const filterData = Pick(req.query, [
    "searchTerm",
    "categories",
    "brands",
    "minPrice",
    "maxPrice",
  ]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);

  const result = await ProductServices.getProductsForManageFromDB(
    filterData,
    paginationOptions as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Products retrieved successfully",
    ...result,
  });
});

const CheckSku = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.CheckSkuFromDB(req.params.sku);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Checking  status retrieved successfully",
    data: result,
  });
});

const ProductControllers = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getSearchProducts,
  getRelatedProductsByProductSlug,
  getRecentlyViewedProducts,
  getFeaturedProducts,
  getRecommendedProducts,
  getProductBySlugForCustomerView,
  getMyProducts,
  getProductsForManage,
  CheckSku,
};

export default ProductControllers;

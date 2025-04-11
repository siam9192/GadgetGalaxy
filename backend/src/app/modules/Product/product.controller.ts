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

const updateProductStock = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.updateProductStockIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product stock updated successfully",
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
const softDeleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.softDeleteProductFromDB(req.params.id);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Product deleted successfully",
    data: result,
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
    req.user,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Products retrieved successfully",
    ...result,
  });
});

const getCategoryProducts = catchAsync(async (req: Request, res: Response) => {
  const filterQuery = Pick(req.query, ["brand", "minPrice", "maxPrice"]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);

  const result = await ProductServices.getCategoryProductsFromDB(
    req.params.slug,
    filterQuery,
    paginationOptions as any,
    req.user,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Products retrieved successfully",
    ...result,
  });
});


const getBrandProducts = catchAsync(async (req: Request, res: Response) => {
  const filterQuery = Pick(req.query, ["category", "minPrice", "maxPrice"]);
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result = await ProductServices.getBrandProductsFromDB(
    req.params.brandName,
    filterQuery,
    paginationOptions as any,
    req.user,
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

const getRelatedProductsByProductSlug = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductServices.getRelatedProductsByProductSlugFromDB(
      req.params.slug,
      req.user,
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
    req.user,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Featured Products retrieved successfully",
    ...result,
  });
});

const getNewArrivalProductsFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = Pick(req.query, paginationOptionKeys);
    const result = await ProductServices.getNewArrivalProductsFromDB(
      paginationOptions as IPaginationOptions,
      req.user,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "New Arrival Products retrieved successfully",
      ...result,
    });
  },
);

const getRecommendedProducts = catchAsync(
  async (req: Request, res: Response) => {
    // const result = await ProductServices.getRecommendedProductsFromDB(req.user);
    // sendSuccessResponse(res, {
    //   statusCode: httpStatus.OK,
    //   message: "Product retrieved successfully",
    //   data: result,
    // });
  },
);

const getTopBrandsProducts = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductServices.getTopBrandProductsFromDB(req.user,req.params.id);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: "Top brand products retrieved successfully",
      data: result,
    });
  },
);

const getProductsForManage = catchAsync(async (req: Request, res: Response) => {
  const filterData = Pick(req.query, [
    "searchTerm",
    "category",
    "brand",
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

const getStockOutProducts = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = Pick(req.query, paginationOptionKeys);
  const result =
    await ProductServices.getStockOutProductsFromDB(paginationOptions);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Stock out Products retrieved successfully",
    ...result,
  });
});

const createMany =  catchAsync(async (req: Request, res: Response) => {
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "successfully",
    data:await Promise.all(req.body.map(b=> ProductServices.createProductIntoDB(b)))
  });
});

const getProductVariants = catchAsync(async (req: Request, res: Response) => {
  const result =
    await ProductServices.getProductVariantsFromDB(req.params.id);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: " retrieved successfully",
    data:result
  });
});
const ProductControllers = {
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
  softDeleteProduct,
  getSearchProducts,
  getCategoryProducts,
  getBrandProducts,
  getRelatedProductsByProductSlug,
  getRecentlyViewedProducts,
  getFeaturedProducts,
  getTopBrandsProducts,
  getNewArrivalProductsFromDB,
  getRecommendedProducts,
  getProductBySlugForCustomerView,
  getProductsForManage,
  getStockOutProducts,
  createMany,
  getProductVariants
};

export default ProductControllers;

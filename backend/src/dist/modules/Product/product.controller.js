"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const response_1 = require("../../shared/response");
const http_status_1 = __importDefault(require("../../shared/http-status"));
const product_service_1 = __importDefault(require("./product.service"));
const pick_1 = __importDefault(require("../../utils/pick"));
const constant_1 = require("../../utils/constant");
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.createProductIntoDB(req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: "Product created successfully",
        data: result,
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.updateProductIntoDB(req.params.id, req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product updated successfully",
        data: result,
    });
}));
const updateProductStock = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.updateProductStockIntoDB(req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product stock updated successfully",
        data: result,
    });
}));
const deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.deleteProductFromDB(req.params.productId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product deleted successfully",
        data: result,
    });
}));
const softDeleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.softDeleteProductFromDB(req.params.id);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product deleted successfully",
        data: result,
    });
}));
const getSearchProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterQuery = (0, pick_1.default)(req.query, [
        "searchTerm",
        "category",
        "brand",
        "minPrice",
        "maxPrice",
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, constant_1.paginationOptionKeys);
    const result = yield product_service_1.default.getSearchProductsFromDB(filterQuery, paginationOptions, req.user);
    (0, response_1.sendSuccessResponse)(res, Object.assign({ statusCode: http_status_1.default.OK, message: "Products retrieved successfully" }, result));
}));
const getCategoryProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterQuery = (0, pick_1.default)(req.query, ["brand", "minPrice", "maxPrice"]);
    const paginationOptions = (0, pick_1.default)(req.query, constant_1.paginationOptionKeys);
    const result = yield product_service_1.default.getCategoryProductsFromDB(req.params.slug, filterQuery, paginationOptions, req.user);
    (0, response_1.sendSuccessResponse)(res, Object.assign({ statusCode: http_status_1.default.OK, message: "Products retrieved successfully" }, result));
}));
const getBrandProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterQuery = (0, pick_1.default)(req.query, ["category", "minPrice", "maxPrice"]);
    const paginationOptions = (0, pick_1.default)(req.query, constant_1.paginationOptionKeys);
    const result = yield product_service_1.default.getBrandProductsFromDB(req.params.brandName, filterQuery, paginationOptions, req.user);
    (0, response_1.sendSuccessResponse)(res, Object.assign({ statusCode: http_status_1.default.OK, message: "Products retrieved successfully" }, result));
}));
const getRecentlyViewedProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.getRecentlyViewedProductsFromDB(req.user, req.params.ids);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Recently viewed products retrieved successfully",
        data: result,
    });
}));
const getProductBySlugForCustomerView = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.getProductBySlugForCustomerViewFromDB(req.user, req.params.slug);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Product retrieved successfully",
        data: result,
    });
}));
const getRelatedProductsByProductSlug = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.getRelatedProductsByProductSlugFromDB(req.params.slug, req.user);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Related Products retrieved successfully",
        data: result,
    });
}));
const getFeaturedProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(req.query, constant_1.paginationOptionKeys);
    const result = yield product_service_1.default.getFeaturedProductsFromDB(paginationOptions, req.user);
    (0, response_1.sendSuccessResponse)(res, Object.assign({ statusCode: http_status_1.default.OK, message: "Featured Products retrieved successfully" }, result));
}));
const getNewArrivalProductsFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(req.query, constant_1.paginationOptionKeys);
    const result = yield product_service_1.default.getNewArrivalProductsFromDB(paginationOptions, req.user);
    (0, response_1.sendSuccessResponse)(res, Object.assign({ statusCode: http_status_1.default.OK, message: "New Arrival Products retrieved successfully" }, result));
}));
const getRecommendedProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await ProductServices.getRecommendedProductsFromDB(req.user);
    // sendSuccessResponse(res, {
    //   statusCode: httpStatus.OK,
    //   message: "Product retrieved successfully",
    //   data: result,
    // });
}));
const getTopBrandsProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.getTopBrandProductsFromDB(req.user, req.params.id);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Top brand products retrieved successfully",
        data: result,
    });
}));
const getProductsForManage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterData = (0, pick_1.default)(req.query, [
        "searchTerm",
        "category",
        "brand",
        "minPrice",
        "maxPrice",
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, constant_1.paginationOptionKeys);
    const result = yield product_service_1.default.getProductsForManageFromDB(filterData, paginationOptions);
    (0, response_1.sendSuccessResponse)(res, Object.assign({ statusCode: http_status_1.default.OK, message: "Products retrieved successfully" }, result));
}));
const getStockOutProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(req.query, constant_1.paginationOptionKeys);
    const result = yield product_service_1.default.getStockOutProductsFromDB(paginationOptions);
    (0, response_1.sendSuccessResponse)(res, Object.assign({ statusCode: http_status_1.default.OK, message: "Stock out Products retrieved successfully" }, result));
}));
const createMany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "successfully",
        data: yield Promise.all(req.body.map((b) => product_service_1.default.createProductIntoDB(b))),
    });
}));
const getProductVariants = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.default.getProductVariantsFromDB(req.params.id);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: " retrieved successfully",
        data: result,
    });
}));
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
    getProductVariants,
};
exports.default = ProductControllers;

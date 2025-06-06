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
const category_service_1 = __importDefault(require("./category.service"));
const pick_1 = __importDefault(require("../../utils/pick"));
const constant_1 = require("../../utils/constant");
const createCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.default.createCategoryIntoDB(req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: "Category created  successfully",
        data: result,
    });
}));
const getCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterOptions = (0, pick_1.default)(req.query, ["searchTerm", "parentId"]);
    const options = (0, pick_1.default)(req.query, constant_1.paginationOptionKeys);
    const result = yield category_service_1.default.getCategoriesFromDB(filterOptions, options);
    (0, response_1.sendSuccessResponse)(res, Object.assign({ statusCode: http_status_1.default.OK, message: "Categories retrieved successfully" }, result));
}));
const getChildCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.default.getChildCategoriesBySlugFromDB(req.params.slug);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: "Sub Categories retrieved successfully",
        data: result,
    });
}));
const getPopularCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.default.getPopularCategoriesFromDB();
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: "Popular Categories retrieved successfully",
        data: result,
    });
}));
const getSearchRelatedCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, pick_1.default)(req.query, ["searchTerm"]);
    const result = yield category_service_1.default.getSearchRelatedCategoriesFromDB(query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Related Categories retrieved successfully",
        data: result,
    });
}));
const getBrandRelatedCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.default.getBrandRelatedCategoriesFormDB(req.params.brandName);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Related Categories retrieved successfully",
        data: result,
    });
}));
const getFeaturedCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.default.getFeaturedCategoriesFromDB();
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Featured Categories retrieved successfully",
        data: result,
    });
}));
const updateCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.default.updateCategoryIntoDB(req.params.id, req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Category updated successfully",
        data: result,
    });
}));
const getAllVisibleCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.default.getAllVisibleCategoriesFromDB();
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Category retrieved successfully",
        data: result,
    });
}));
const getSearchKeywordCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.default.getSearchKeywordCategoriesFromDB(req.params.keyword);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Category retrieved successfully",
        data: result,
    });
}));
const CategoryControllers = {
    createCategory,
    getCategories,
    getPopularCategories,
    getFeaturedCategories,
    getSearchRelatedCategories,
    getBrandRelatedCategories,
    updateCategory,
    getAllVisibleCategories,
    getSearchKeywordCategories,
    getChildCategories,
};
exports.default = CategoryControllers;

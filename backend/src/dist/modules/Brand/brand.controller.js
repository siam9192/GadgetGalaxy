"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const response_1 = require("../../shared/response");
const http_status_1 = __importDefault(require("../../shared/http-status"));
const brand_service_1 = __importDefault(require("./brand.service"));
const pick_1 = __importDefault(require("../../utils/pick"));
const constant_1 = require("../../utils/constant");
const createBrand = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_service_1.default.createBrandIntoDB(
      req.user,
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: "Brand created successfully",
      data: result,
    });
  }),
);
const getBrands = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, ["searchTerm", "origin"]);
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result = yield brand_service_1.default.getBrandsFromDB(
      filter,
      paginationOptions,
    );
    (0, response_1.sendSuccessResponse)(
      res,
      Object.assign(
        {
          statusCode: http_status_1.default.OK,
          message: "Brands retrieved successfully",
        },
        result,
      ),
    );
  }),
);
const getBrandsForManage = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.default)(req.query, ["searchTerm", "origin"]);
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result = yield brand_service_1.default.getBrandsForManageFromDB(
      filter,
      paginationOptions,
    );
    (0, response_1.sendSuccessResponse)(
      res,
      Object.assign(
        {
          statusCode: http_status_1.default.OK,
          message: "Brands retrieved successfully",
        },
        result,
      ),
    );
  }),
);
const getPopularBrands = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result =
      yield brand_service_1.default.getPopularBrandsFromDB(paginationOptions);
    (0, response_1.sendSuccessResponse)(
      res,
      Object.assign(
        {
          statusCode: http_status_1.default.OK,
          message: "Popular Brands retrieved successfully",
        },
        result,
      ),
    );
  }),
);
const getFeaturedBrands = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(
      req.query,
      constant_1.paginationOptionKeys,
    );
    const result =
      yield brand_service_1.default.getPopularBrandsFromDB(paginationOptions);
    (0, response_1.sendSuccessResponse)(
      res,
      Object.assign(
        {
          statusCode: http_status_1.default.OK,
          message: "Featured Brands retrieved successfully",
        },
        result,
      ),
    );
  }),
);
const getSearchRelatedBrands = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paginationOptions = (0, pick_1.default)(req.query, ["searchTerm"]);
    const result =
      yield brand_service_1.default.getSearchRelatedBrandsFromDB(
        paginationOptions,
      );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Related Brands retrieved successfully",
      data: result,
    });
  }),
);
const getCategoryRelatedBrands = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_service_1.default.getCategoryRelatedBrandsFromDB(
      req.params.slug,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Related Brands retrieved successfully",
      data: result,
    });
  }),
);
const getSearchKeywordBrands = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_service_1.default.getSearchKeywordBrandsFromDB(
      req.params.keyword,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Related Brands retrieved successfully",
      data: result,
    });
  }),
);
const updateBrand = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_service_1.default.updateBrandIntoDB(
      req.user,
      req.params.id,
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: "Brand updated successfully",
      data: result,
    });
  }),
);
const BrandControllers = {
  createBrand,
  getBrands,
  getBrandsForManage,
  getFeaturedBrands,
  getSearchRelatedBrands,
  getCategoryRelatedBrands,
  getPopularBrands,
  getSearchKeywordBrands,
  updateBrand,
};
exports.default = BrandControllers;

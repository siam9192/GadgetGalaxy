"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(
  require("../../middlewares/validateRequest"),
);
const brand_validation_1 = __importDefault(require("./brand.validation"));
const brand_controller_1 = __importDefault(require("./brand.controller"));
const router = (0, express_1.Router)();
router.post(
  "/",
  (0, validateRequest_1.default)(
    brand_validation_1.default.CreateBrandValidation,
  ),
  brand_controller_1.default.createBrand,
);
router.put(
  "/",
  (0, auth_1.default)(
    (0, validateRequest_1.default)(
      brand_validation_1.default.UpdateBrandValidation,
    ),
  ),
  brand_controller_1.default.updateBrand,
);
router.get("/", brand_controller_1.default.getBrands);
router.get("/manage", brand_controller_1.default.getBrandsForManage);
router.get("/popular", brand_controller_1.default.getPopularBrands);
router.get("/featured", brand_controller_1.default.getFeaturedBrands);
router.get(
  "/search-related",
  brand_controller_1.default.getSearchRelatedBrands,
);
router.get(
  "/category-related/:slug",
  brand_controller_1.default.getSearchRelatedBrands,
);
router.get(
  "/search/:keyword",
  brand_controller_1.default.getSearchRelatedBrands,
);
const BrandRouter = router;
exports.default = BrandRouter;

"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = __importDefault(require("./category.controller"));
const validateRequest_1 = __importDefault(
  require("../../middlewares/validateRequest"),
);
const category_validation_1 = __importDefault(require("./category.validation"));
const router = (0, express_1.Router)();
router.post(
  "/",
  (0, validateRequest_1.default)(
    category_validation_1.default.CreateCategoryValidationSchema,
  ),
  category_controller_1.default.createCategory,
);
router.get("/", category_controller_1.default.getCategories);
router.get("/popular", category_controller_1.default.getPopularCategories);
router.get("/featured", category_controller_1.default.getFeaturedCategories);
router.get(
  "/search-related",
  category_controller_1.default.getSearchRelatedCategories,
);
router.put(
  "/:id",
  (0, validateRequest_1.default)(
    category_validation_1.default.UpdateCategoryValidationSchema,
  ),
  category_controller_1.default.updateCategory,
);
router.get("/visible", category_controller_1.default.getAllVisibleCategories);
router.get("/search", category_controller_1.default.getSearchKeywordCategories);
const CategoryRouter = router;
exports.default = CategoryRouter;

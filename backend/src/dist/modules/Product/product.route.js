"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_validation_1 = __importDefault(require("./product.validation"));
const product_controller_1 = __importDefault(require("./product.controller"));
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.MODERATOR]), (0, validateRequest_1.default)(product_validation_1.default.CreateProductValidation), product_controller_1.default.createProduct);
router.post("/many", product_controller_1.default.createMany);
router.put("/:id", (0, validateRequest_1.default)(product_validation_1.default.UpdateProductValidation), product_controller_1.default.updateProduct);
router.patch("/stock", (0, auth_1.default)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.MODERATOR]), (0, validateRequest_1.default)(product_validation_1.default.UpdateProductStockValidation), product_controller_1.default.updateProductStock);
router.delete("/:id", (0, auth_1.default)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.MODERATOR]), product_controller_1.default.softDeleteProduct);
router.get("/search", (0, auth_1.default)([client_1.UserRole.CUSTOMER], { providerMode: true }), product_controller_1.default.getSearchProducts);
router.get("/details/:slug", (0, auth_1.default)([client_1.UserRole.CUSTOMER], { providerMode: true }), product_controller_1.default.getProductBySlugForCustomerView);
router.get("/related/:slug", (0, auth_1.default)([client_1.UserRole.CUSTOMER], { providerMode: true }), product_controller_1.default.getRelatedProductsByProductSlug);
router.get("/category/:slug", (0, auth_1.default)([client_1.UserRole.CUSTOMER], { providerMode: true }), product_controller_1.default.getCategoryProducts);
router.get("/brand/:brandName", (0, auth_1.default)([client_1.UserRole.CUSTOMER], { providerMode: true }), product_controller_1.default.getBrandProducts);
router.get("/new-arrival", (0, auth_1.default)([client_1.UserRole.CUSTOMER], { providerMode: true }), product_controller_1.default.getNewArrivalProductsFromDB);
router.get("/top-brand/:id", (0, auth_1.default)([client_1.UserRole.CUSTOMER], { providerMode: true }), product_controller_1.default.getTopBrandsProducts);
router.get("/:slug/related", (0, auth_1.default)([client_1.UserRole.CUSTOMER], { providerMode: true }), product_controller_1.default.getRelatedProductsByProductSlug);
router.get("/recently-viewed/:ids", (0, auth_1.default)([client_1.UserRole.CUSTOMER], { providerMode: true }), product_controller_1.default.getRecentlyViewedProducts);
router.get("/stock-out", (0, auth_1.default)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.MODERATOR]), product_controller_1.default.getStockOutProducts);
// router.get(
//   "/recently-viewed",
//   auth([UserRole.CUSTOMER], { providerMode: true }),
//   ProductControllers.getRecentlyViewedProducts,
// );
router.get("/featured", (0, auth_1.default)([client_1.UserRole.CUSTOMER], { providerMode: true }), product_controller_1.default.getFeaturedProducts);
// Only staff can access
router.get("/manage", (0, auth_1.default)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.MODERATOR]), product_controller_1.default.getProductsForManage);
router.get("/:id/variants", product_controller_1.default.getProductVariants);
const ProductRouter = router;
exports.default = ProductRouter;

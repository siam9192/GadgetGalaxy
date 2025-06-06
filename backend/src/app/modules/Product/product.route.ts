import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import ProductValidations from "./product.validation";
import ProductControllers from "./product.controller";

const router = Router();

router.post(
  "/",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR]),
  validateRequest(ProductValidations.CreateProductValidation),
  ProductControllers.createProduct,
);
router.post("/many", ProductControllers.createMany);
router.put(
  "/:id",
  validateRequest(ProductValidations.UpdateProductValidation),
  ProductControllers.updateProduct,
);

router.patch(
  "/stock",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR]),
  validateRequest(ProductValidations.UpdateProductStockValidation),
  ProductControllers.updateProductStock,
);

router.delete(
  "/:id",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR]),
  ProductControllers.softDeleteProduct,
);

router.get(
  "/search",
  auth([UserRole.CUSTOMER], { providerMode: true }),
  ProductControllers.getSearchProducts,
);

router.get(
  "/details/:slug",
  auth([UserRole.CUSTOMER], { providerMode: true }),
  ProductControllers.getProductBySlugForCustomerView,
);
router.get(
  "/related/:slug",
  auth([UserRole.CUSTOMER], { providerMode: true }),
  ProductControllers.getRelatedProductsByProductSlug,
);
router.get(
  "/category/:slug",
  auth([UserRole.CUSTOMER], { providerMode: true }),
  ProductControllers.getCategoryProducts,
);

router.get(
  "/brand/:brandName",
  auth([UserRole.CUSTOMER], { providerMode: true }),
  ProductControllers.getBrandProducts,
);

router.get(
  "/new-arrival",
  auth([UserRole.CUSTOMER], { providerMode: true }),
  ProductControllers.getNewArrivalProductsFromDB,
);
router.get(
  "/top-brand/:id",
  auth([UserRole.CUSTOMER], { providerMode: true }),
  ProductControllers.getTopBrandsProducts,
);

router.get(
  "/:slug/related",
  auth([UserRole.CUSTOMER], { providerMode: true }),
  ProductControllers.getRelatedProductsByProductSlug,
);

router.get(
  "/recently-viewed/:ids",
  auth([UserRole.CUSTOMER], { providerMode: true }),
  ProductControllers.getRecentlyViewedProducts,
);

router.get(
  "/stock-out",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR]),
  ProductControllers.getStockOutProducts,
);

// router.get(
//   "/recently-viewed",
//   auth([UserRole.CUSTOMER], { providerMode: true }),
//   ProductControllers.getRecentlyViewedProducts,
// );
router.get(
  "/featured",
  auth([UserRole.CUSTOMER], { providerMode: true }),
  ProductControllers.getFeaturedProducts,
);

// Only staff can access
router.get(
  "/manage",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR]),
  ProductControllers.getProductsForManage,
);

router.get("/:id/variants", ProductControllers.getProductVariants);

const ProductRouter = router;

export default ProductRouter;

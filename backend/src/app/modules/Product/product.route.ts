import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import ProductValidations from "./product.validation";
import ProductControllers from "./product.controller";

const router = Router();

router.post(
  "/",
  validateRequest(ProductValidations.CreateProductValidation),
  ProductControllers.createProduct,
);
router.put(
  "/:id",
  validateRequest(ProductValidations.UpdateProductValidation),
  ProductControllers.updateProduct,
);

router.patch(
  "/stock",
  validateRequest(ProductValidations.UpdateProductStockValidation),
  ProductControllers.updateProductStock,
);

router.delete("/:id", ProductControllers.softDeleteProduct);

router.get("/search", ProductControllers.getSearchProducts);
router.get(
  "/details/:slug",
  ProductControllers.getProductBySlugForCustomerView,
);

router.get("/new-arrival", ProductControllers.getNewArrivalProductsFromDB);

router.get(
  "/:slug/related",
  ProductControllers.getRelatedProductsByProductSlug,
);

router.get("/stock-out", ProductControllers.getStockOutProducts);

// router.get(
//   "/recently-viewed",
//   auth([UserRole.Customer], { providerMode: true }),
//   ProductControllers.getRecentlyViewedProducts,
// );
router.get("/featured", ProductControllers.getFeaturedProducts);

// Only staff can access
router.get("/manage", ProductControllers.getProductsForManage);
// router.get(
//   "/recommended",
//   auth([UserRole.Customer]),
//   ProductControllers.getRecommendedProducts,
// );

// router.get(
//   "/check-sku",
//   auth(Object.values(UserRole).filter((ite) => ite !== UserRole.Customer)),
//   ProductControllers.CheckSku,
// );

const ProductRouter = router;

export default ProductRouter;

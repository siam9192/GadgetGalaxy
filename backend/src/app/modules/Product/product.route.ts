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

router.get("/search", ProductControllers.getSearchProducts);

// router.put(
//   "/",
//   auth(Object.values(UserRole).filter((ite) => ite !== UserRole.Customer)),
//   validateRequest(ProductValidations.UpdateProductValidation),
//   ProductControllers.updateProduct,
// );

// router.delete(
//   "/:productId",
//   auth(Object.values(UserRole).filter((ite) => ite !== UserRole.Customer)),
//   ProductControllers.deleteProduct,
// );

// router.get("/", ProductControllers.getProducts);
// router.get(
//   "/get-by-slug/:slug",
//   auth([UserRole.Customer], { providerMode: true }),
//   ProductControllers.getProductBySlugForCustomerView,
// );

// router.get(
//   "/related/:productSlug",
//   ProductControllers.getRelatedProductsByProductSlug,
// );

// router.get(
//   "/recently-viewed",
//   auth([UserRole.Customer], { providerMode: true }),
//   ProductControllers.getRecentlyViewedProducts,
// );
// router.get("/featured", ProductControllers.getFeaturedProducts);
// router.get(
//   "/recommended",
//   auth([UserRole.Customer]),
//   ProductControllers.getRecommendedProducts,
// );

// // Only staff can access
// router.get(
//   "/for-manage",
//   auth(Object.values(UserRole).filter((ite) => ite !== UserRole.Customer)),
//   ProductControllers.getProductsForManage,
// );

// router.get(
//   "/check-sku",
//   auth(Object.values(UserRole).filter((ite) => ite !== UserRole.Customer)),
//   ProductControllers.CheckSku,
// );

const ProductRouter = router;

export default ProductRouter;

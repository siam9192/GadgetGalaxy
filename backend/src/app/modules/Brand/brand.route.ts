import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import BrandValidations from "./brand.validation";
import BrandControllers from "./brand.controller";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR]),
  validateRequest(BrandValidations.CreateBrandValidation),
  BrandControllers.createBrand,
);

router.put(
  "/",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR]),
  validateRequest(BrandValidations.UpdateBrandValidation),
  BrandControllers.updateBrand,
);
router.get("/", BrandControllers.getBrands);
router.get(
  "/manage",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR]),
  BrandControllers.getBrandsForManage,
);
router.get("/popular", BrandControllers.getPopularBrands);
router.get("/featured", BrandControllers.getFeaturedBrands);
router.get("/search-related",BrandControllers.getSearchRelatedBrands);
router.get("/top", BrandControllers.getTopBrands);
router.get("/category-related/:slug", BrandControllers.getCategoryRelatedBrands);
router.get("/search/:keyword", BrandControllers.getSearchRelatedBrands);

const BrandRouter = router;

export default BrandRouter;

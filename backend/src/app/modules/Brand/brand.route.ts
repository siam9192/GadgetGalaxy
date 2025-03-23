import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import BrandValidations from "./brand.validation";
import BrandControllers from "./brand.controller";

const router = Router();

router.post(
  "/",

  validateRequest(BrandValidations.CreateBrandValidation),
  BrandControllers.createBrand,
);

router.put(
  "/",
  auth(validateRequest(BrandValidations.UpdateBrandValidation)),
  BrandControllers.updateBrand,
);
router.get("/", BrandControllers.getBrands);
router.get("/manage", BrandControllers.getBrandsForManage);
router.get("/popular", BrandControllers.getPopularBrands);
router.get("/featured", BrandControllers.getFeaturedBrands);
router.get("/search-related", BrandControllers.getSearchRelatedBrands);
router.get("/category-related/:slug", BrandControllers.getSearchRelatedBrands);
const BrandRouter = router;

export default BrandRouter;

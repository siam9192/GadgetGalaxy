import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import BrandValidations from "./brand.validation";
import BrandControllers from "./brand.controller";

const router = Router();

router.post(
  "/",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  validateRequest(BrandValidations.CreateBrandValidation),
  BrandControllers.createBrand,
);

router.put(
  "/",
  auth(
    [UserRole.SuperAdmin, UserRole.Admin],
    validateRequest(BrandValidations.UpdateBrandValidation),
  ),
  BrandControllers.updateBrand,
);
router.get("/", BrandControllers.getBrands);

router.get("/popular", BrandControllers.getPopularBrands);

const BrandRouter = router;

export default BrandRouter;

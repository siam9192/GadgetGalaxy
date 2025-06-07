import { Router } from "express";
import CategoryControllers from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import CategoryValidations from "./category.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR]),
  validateRequest(CategoryValidations.CreateCategoryValidationSchema),
  CategoryControllers.createCategory,
);
router.get("/", CategoryControllers.getCategories);
router.get("/:slug/subcategories", CategoryControllers.getChildCategories);
router.get("/popular", CategoryControllers.getPopularCategories);
router.get("/featured", CategoryControllers.getFeaturedCategories);
router.get("/search-related", CategoryControllers.getSearchRelatedCategories);
router.get(
  "/brand-related/:brandId",
  CategoryControllers.getBrandRelatedCategories,
);

router.get("/visible", CategoryControllers.getAllVisibleCategories);

router.get("/search/:keyword", CategoryControllers.getSearchKeywordCategories);
router.put(
  "/:id",
  validateRequest(CategoryValidations.UpdateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);
const CategoryRouter = router;
export default CategoryRouter;

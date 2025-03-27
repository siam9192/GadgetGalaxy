import { Router } from "express";
import CategoryControllers from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import CategoryValidations from "./category.validation";

const router = Router();

router.post(
  "/",
  validateRequest(CategoryValidations.CreateCategoryValidationSchema),
  CategoryControllers.createCategory,
);
router.get("/", CategoryControllers.getCategories);
router.get("/popular", CategoryControllers.getPopularCategories);
router.get("/featured", CategoryControllers.getFeaturedCategories);
router.get("/search-related", CategoryControllers.getSearchRelatedCategories);
router.put(
  "/:id",
  validateRequest(CategoryValidations.UpdateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);

router.get("/visible", CategoryControllers.getAllVisibleCategories);

router.get("/search", CategoryControllers.getSearchKeywordCategories);
const CategoryRouter = router;
export default CategoryRouter;

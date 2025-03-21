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
router.put(
  "/",
  validateRequest(CategoryValidations.UpdateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);
const CategoryRouter = router;
export default CategoryRouter;

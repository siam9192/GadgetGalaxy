import { Router } from "express";
import UtilControllers from "./util.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/search-keyword/:keyword", UtilControllers.getSearchKeywordResults);
const UtilRouter = router;

router.get("/my-count",auth(Object.values(UserRole)),UtilControllers.getUtilCounts);

export default UtilRouter;

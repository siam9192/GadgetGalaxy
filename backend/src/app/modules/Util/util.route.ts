import { Router } from "express";
import UtilControllers from "./util.controller";

const router = Router();

router.get("/search-keyword/:keyword", UtilControllers.getSearchKeywordResults);
const UtilRouter = router;

export default UtilRouter;

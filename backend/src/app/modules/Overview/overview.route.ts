import { Router } from "express";
import OverviewControllers from "./overview.controller";

const router = Router();

router.get("/all", OverviewControllers.getAllOverviewData);

router.get("/order", OverviewControllers.getOrdersOverviewData);

const OverviewRouter = router;

export default OverviewRouter;

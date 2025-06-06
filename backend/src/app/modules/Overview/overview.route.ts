import { Router } from "express";
import OverviewControllers from "./overview.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/all", OverviewControllers.getAllOverviewData);

router.get("/order", OverviewControllers.getOrdersOverviewData);

router.get(
  "/my",
  auth([UserRole.CUSTOMER]),
  OverviewControllers.getMyOverviewData,
);
const OverviewRouter = router;

export default OverviewRouter;

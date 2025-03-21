import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import ActivityLogControllers from "./activity-log.controller";

const router = Router();

router.get(
  "/",
  auth([UserRole.SuperAdmin]),
  ActivityLogControllers.getActivityLogs,
);

router.delete("/:id", ActivityLogControllers.deleteActivity);

const ActivityLogRouter = router;

export default ActivityLogRouter;

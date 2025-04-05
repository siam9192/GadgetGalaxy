import { Router } from "express";
import ActivityLogControllers from "./administratorActivityLog.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = Router();

router.get(
  "/",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  ActivityLogControllers.getActivityLogs,
);

router.get(
  "/administrator/:id",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  ActivityLogControllers.getAdministratorActivityLogs,
);

router.delete(
  "/:id",
  auth([UserRole.SUPER_ADMIN]),
  ActivityLogControllers.deleteActivity,
);

const AdministratorActivityLogRouter = router;

export default AdministratorActivityLogRouter;

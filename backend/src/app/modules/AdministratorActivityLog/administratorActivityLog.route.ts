import { Router } from "express";
import ActivityLogControllers from "./administratorActivityLog.controller";

const router = Router();

router.get("/", ActivityLogControllers.getActivityLogs);

router.get(
  "/administrator/:id",
  ActivityLogControllers.getAdministratorActivityLogs,
);

router.delete("/:id", ActivityLogControllers.deleteActivity);

const AdministratorActivityLogRouter = router;

export default AdministratorActivityLogRouter;

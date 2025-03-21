import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import NotificationValidations from "./notification.validation";
import NotificationControllers from "./notification.controller";

const router = Router();

router.post(
  "/",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  validateRequest(NotificationValidations.CreateNotificationValidation),
  NotificationControllers.createNotification,
);

router.get(
  "/",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  NotificationControllers.getNotifications,
);

router.get(
  "/my",
  auth(Object.values(UserRole)),
  NotificationControllers.getMyNotifications,
);

const NotificationRouter = router;

export default NotificationRouter;

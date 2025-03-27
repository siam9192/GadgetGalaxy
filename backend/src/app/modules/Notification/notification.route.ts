import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import NotificationValidations from "./notification.validation";
import NotificationControllers from "./notification.controller";

const router = Router();

router.post(
  "/",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  validateRequest(NotificationValidations.CreateNotificationValidation),
  NotificationControllers.createNotification,
);

router.get(
  "/",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  NotificationControllers.getNotifications,
);

router.get(
  "/my",
  auth(Object.values(UserRole)),
  NotificationControllers.getMyNotifications,
);

router.patch(
  "/read",
  auth(Object.values(UserRole)),
  NotificationControllers.notificationsSetAsRead,
);

const NotificationRouter = router;

export default NotificationRouter;

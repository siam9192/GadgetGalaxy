import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import UserValidations from "./user.validation";
import UserControllers from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.patch(
  "/change-status",
  validateRequest(UserValidations.ChangeUserStatusValidation),
  UserControllers.changeUserStatus,
);

router.get("/customers", UserControllers.getCustomers);
router.get("/administrators", UserControllers.getAdministrators);

router.delete("/:userId", UserControllers.softDeleteUser);

router.post(
  "/create-administrator",
  auth([UserRole.SUPER_ADMIN]),
  validateRequest(UserValidations.CreateAdministratorValidation),
  UserControllers.createAdministrator,
);
const UserRouter = router;

export default UserRouter;

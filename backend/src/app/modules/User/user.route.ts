import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import UserValidations from "./user.validation";
import UserControllers from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.patch(
  "/change-status",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  validateRequest(UserValidations.ChangeUserStatusValidation),
  UserControllers.changeUserStatus,
);

router.get(
  "/customers",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  UserControllers.getCustomers,
);
router.get(
  "/staffs",
  auth([UserRole.SuperAdmin]),
  UserControllers.getStaffsFromDB,
);
router.delete(
  "/:userId",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  UserControllers.softDeleteUser,
);

router.post(
  "/create-staff",
  auth([UserRole.SuperAdmin]),
  UserControllers.createStaff,
  validateRequest(UserValidations.CreateStaffValidation),
);
const UserRouter = router;

export default UserRouter;

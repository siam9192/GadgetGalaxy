import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import UserValidations from "./user.validation";
import UserControllers from "./user.controller";

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
  "/create-staff",
  UserControllers.createStaff,
  validateRequest(UserValidations.CreateStaffValidation),
);
const UserRouter = router;

export default UserRouter;

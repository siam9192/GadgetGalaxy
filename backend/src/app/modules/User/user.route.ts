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
router.get("/staffs", UserControllers.getStaffsFromDB);
router.delete("/:userId", UserControllers.softDeleteUser);
const UserRouter = router;

export default UserRouter;

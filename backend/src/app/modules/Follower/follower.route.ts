import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import FollowerValidations from "./follower.validation";
import FollowerControllers from "./follower.controllers";

const router = Router();

router.post(
  "/",
  auth(UserRole.Customer),
  validateRequest(FollowerValidations.CreateFollowerValidation),
  FollowerControllers.createFollower,
);
router.get(
  "/my-shop",
  auth(UserRole.Vendor),
  FollowerControllers.getMyShopFollowers,
);

router.get(
  "/my-following",
  auth(UserRole.Customer),
  FollowerControllers.getMyFollowingShops,
);

router.delete(
  "/:shopId",
  auth(UserRole.Customer),
  FollowerControllers.deleteFollower,
);
const FollowerRouter = router;

export default FollowerRouter;

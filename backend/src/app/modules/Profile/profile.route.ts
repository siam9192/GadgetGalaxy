import { Router } from "express";
import ProfileControllers from "./profile.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/my",
  auth(Object.values(UserRole)),
  ProfileControllers.getMyProfile
);


router.get(
  "/:id",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  ProfileControllers.getUserProfileById
);

router.put(
  "/",
  auth(Object.values(UserRole)),
  ProfileControllers.updateMyProfile
);

const ProfileRouter = router;

export default ProfileRouter;

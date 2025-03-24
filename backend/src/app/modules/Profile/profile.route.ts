import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import ProfileControllers from "./profile.controller";

const router = Router();

router.put(
  "/my",
  auth(Object.values(UserRole)),
  ProfileControllers.updateMyProfile,
);

const ProfileRouter = router;

export default ProfileRouter;

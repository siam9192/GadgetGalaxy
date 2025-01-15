import { Router } from "express";
import ProfileControllers from "./profile.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/:id", ProfileControllers.getUserProfileById);
router.put(
  "/my",
  auth(...Object.values(UserRole)),
  ProfileControllers.updateMyProfile,
);

const ProfileRouter = router;

export default ProfileRouter;

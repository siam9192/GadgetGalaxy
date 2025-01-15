import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import AuthValidations from "./auth.validation";
import AuthControllers from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidations.SignUpValidationSchema),
  AuthControllers.register,
);

router.post("/resend-otp/:token", AuthControllers.resendOtp);

router.post(
  "/register/verify",
  validateRequest(AuthValidations.VerifyAccountOtpValidationSchema),
  AuthControllers.verifyRegisterUsingOTP,
);

router.post(
  "/login",
  validateRequest(AuthValidations.LoginValidationSchema),
  AuthControllers.login,
);

router.patch(
  "/",
  auth(...Object.values(UserRole)),
  validateRequest(AuthValidations.ChangePasswordValidationSchema),
  AuthControllers.changePassword,
);

const AuthRouter = router;

export default AuthRouter;

import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import AuthValidations from "./auth.validation";
import AuthControllers from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { allRoles } from "../../utils/constant";
import { all } from "axios";

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

router.post("/logout", auth(allRoles), AuthControllers.login);

router.patch(
  "/change-password",
  auth(allRoles),
  validateRequest(AuthValidations.ChangePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post("/forget-password/:email", AuthControllers.forgetPassword);
router.post(
  "/reset-password",
  validateRequest(AuthValidations.ResetPasswordValidation),
  AuthControllers.resetPassword,
);

router.get(
  "/accessToken",
  auth(allRoles),
  AuthControllers.getAccessTokenUsingRefreshToken,
);

router.get('/me',auth(allRoles),AuthControllers.getMe)
const AuthRouter = router;

export default AuthRouter;

import { Router } from "express";
import PaymentControllers from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/ispn", PaymentControllers.validatePayment);

router.get("/my", auth([UserRole.CUSTOMER]), PaymentControllers.getMyPayments);

router.get(
  "/manage",
  // auth([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  PaymentControllers.getPayments,
);

const PaymentRouter = router;
export default PaymentRouter;

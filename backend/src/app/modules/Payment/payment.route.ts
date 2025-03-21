import { Router } from "express";
import PaymentControllers from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/ispn", PaymentControllers.validatePayment);

router.get("/my", auth([UserRole.Customer]), PaymentControllers.getMyPayments);

router.get(
  "/",
  auth([UserRole.SuperAdmin, UserRole.Admin]),
  PaymentControllers.getPayments,
);

const PaymentRouter = router;
export default PaymentRouter;

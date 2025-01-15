import { Router } from "express";
import PaymentControllers from "./payment.controller";

const router = Router();

router.get("/:paymentId/success", PaymentControllers.updateSuccessPayment);
router.get("/:paymentId/cancel", PaymentControllers.updateCancelledPayment);

const PaymentRouter = router;
export default PaymentRouter;

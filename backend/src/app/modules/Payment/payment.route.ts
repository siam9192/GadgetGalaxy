import { Router } from "express";
import PaymentControllers from "./payment.controller";

const router = Router();

router.get("/ispn", PaymentControllers.validatePayment);
const PaymentRouter = router;
export default PaymentRouter;

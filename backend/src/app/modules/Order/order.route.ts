import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import OrderControllers from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import OrderValidations from "./order.validation";

const router = Router();

router.post(
  "/init",
  auth([UserRole.Customer]),
  validateRequest(OrderValidations.InitOrderValidation),
  OrderControllers.initOrder,
);

router.get("/",OrderControllers.getOrders)

const OrderRouter = router;

export default OrderRouter;

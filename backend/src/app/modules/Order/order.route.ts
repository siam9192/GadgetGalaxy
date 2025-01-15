import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import OrderControllers from "./order.controller";

const router = Router();

router.post("/", auth(UserRole.Customer), OrderControllers.createOrder);
router.get(
  "/",
  auth(UserRole.Vendor, UserRole.Customer),
  OrderControllers.getMyOrders,
);
const OrderRouter = router;

export default OrderRouter;

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

router.get("/", OrderControllers.getOrders);
router.get("/my", auth([UserRole.Customer]), OrderControllers.getMyOrders);
router.get(
  "/get-by-id/:id",
  auth(Object.values(UserRole)),
  OrderControllers.getOrderById,
);
router.get(
  "/not-reviewed",
  auth([UserRole.Customer]),
  OrderControllers.getNotReviewedOrderItems,
);

router.patch(
  "/update-status",
  auth([UserRole.Admin, UserRole.SuperAdmin]),
  validateRequest(OrderValidations.UpdateOrderStatusByStaffValidation),
  OrderControllers.UpdateOrderStatusByStaff,
);
const OrderRouter = router;

export default OrderRouter;

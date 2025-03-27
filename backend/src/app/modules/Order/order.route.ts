import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import OrderControllers from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import OrderValidations from "./order.validation";
import ProductControllers from "../Product/product.controller";

const router = Router();

router.post(
  "/init",
  auth([UserRole.CUSTOMER]),
  validateRequest(OrderValidations.InitOrderValidation),
  OrderControllers.initOrder,
);

router.post(
  "/place",
  auth([UserRole.CUSTOMER]),
  validateRequest(OrderValidations.PlaceOrderValidation),
  OrderControllers.placeOrder,
);
router.get("/manage", OrderControllers.getOrdersForManage);
router.get("/my", auth([UserRole.CUSTOMER]), OrderControllers.getMyOrders);
router.get(
  "/my/:id",
  auth([UserRole.CUSTOMER]),
  OrderControllers.getMyOrderById,
);
router.get(
  "/manage/:id",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  OrderControllers.getOrderByIdForManage,
);

router.get("/stock-out", ProductControllers.getStockOutProducts);
router.get(
  "/not-reviewed",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  OrderControllers.getNotReviewedOrderItems,
);

router.patch(
  "/update-status",
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  validateRequest(OrderValidations.UpdateOrderStatusByStaffValidation),
  OrderControllers.updateOrderStatus,
);
const OrderRouter = router;

export default OrderRouter;

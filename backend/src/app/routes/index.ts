import { IRouter, Router } from "express";
import AuthRouter from "../modules/Auth/auth.route";
import UserRouter from "../modules/User/user.route";
import CategoryRouter from "../modules/Category/category.route";
import ProductRouter from "../modules/Product/product.route";
import CouponRouter from "../modules/Coupon/coupon.router";
import OrderRouter from "../modules/Order/order.route";
import PaymentRouter from "../modules/Payment/payment.route";
import ProductReviewRouter from "../modules/ProductReview/product-review.route";
import CartItemRouter from "../modules/CartItem/cart-item.route";
import ShippingChargeRouter from "../modules/ShippingCharge/shipping-charge.route";
import NotificationRouter from "../modules/Notification/notification.route";
import ActivityLogRouter from "../modules/ActivityLog/activity-log.route";

type TModuleRoutes = { path: string; router: IRouter }[];
const router = Router();
const moduleRoutes: TModuleRoutes = [
  {
    path: "/auth",
    router: AuthRouter,
  },
  {
    path: "/users",
    router: UserRouter,
  },
  // {
  //   path: "/profile",
  //   router: ProfileRouter,
  // },
  // {
  //   path: "/shops",
  //   router: ShopRouter,
  // },
  {
    path: "/products",
    router: ProductRouter,
  },
  {
    path: "/cart-items",
    router: CartItemRouter,
  },
  {
    path: "/coupons",
    router: CouponRouter,
  },
  {
    path: "/shipping-charges",
    router: ShippingChargeRouter,
  },
  // {
  //   path: "/parent-categories",
  //   router: ParentCategoryRouter,
  // },
  {
    path: "/categories",
    router: CategoryRouter,
  },
  {
    path: "/orders",
    router: OrderRouter,
  },
  // {
  //   path: "/product-reviews",
  //   router: ProductReviewRouter,
  // },
  {
    path: "/payments",
    router: PaymentRouter,
  },
  {
    path: "/notifications",
    router: NotificationRouter,
  },
  {
    path: "/activity-logs",
    router: ActivityLogRouter,
  },
];

const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;

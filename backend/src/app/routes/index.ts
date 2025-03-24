import { IRouter, Router } from "express";
import AuthRouter from "../modules/Auth/auth.route";
import UserRouter from "../modules/User/user.route";
import CategoryRouter from "../modules/Category/category.route";
import ProductRouter from "../modules/Product/product.route";
import OrderRouter from "../modules/Order/order.route";
import PaymentRouter from "../modules/Payment/payment.route";
import CartItemRouter from "../modules/CartItem/cart-item.route";
import ShippingChargeRouter from "../modules/ShippingCharge/shipping-charge.route";
import NotificationRouter from "../modules/Notification/notification.route";
import ActivityLogRouter from "../modules/AdministratorActivityLog/administratorActivityLog.route";
import DiscountRouter from "../modules/Discount/discount.route";
import BrandRouter from "../modules/Brand/brand.route";
import ProfileRouter from "../modules/Profile/profile.route";
import ProductReviewRouter from "../modules/ProductReview/product-review.route";
import AdministratorActivityLogRouter from "../modules/AdministratorActivityLog/administratorActivityLog.route";
import OverviewRouter from "../modules/Overview/overview.route";

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
  {
    path: "/profile",
    router: ProfileRouter,
  },
  {
    path: "/brands",
    router: BrandRouter,
  },
  {
    path: "/products",
    router: ProductRouter,
  },
  {
    path: "/cart-items",
    router: CartItemRouter,
  },
  {
    path: "/discounts",
    router: DiscountRouter,
  },
  {
    path: "/shipping-charges",
    router: ShippingChargeRouter,
  },
  {
    path: "/categories",
    router: CategoryRouter,
  },
  {
    path: "/orders",
    router: OrderRouter,
  },
  {
    path: "/product-reviews",
    router: ProductReviewRouter,
  },
  {
    path: "/payments",
    router: PaymentRouter,
  },
  {
    path: "/notifications",
    router: NotificationRouter,
  },
  {
    path: "/administrator-activity-logs",
    router: AdministratorActivityLogRouter,
  },
  {
    path: "/overview",
    router: OverviewRouter,
  },
];

const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;

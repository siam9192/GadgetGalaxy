import { IRouter, Router } from "express";
import AuthRouter from "../modules/Auth/auth.route";
import UserRouter from "../modules/User/user.route";
import ProfileRouter from "../modules/Profile/profile.route";
import ParentCategoryRouter from "../modules/ParentCategory/parent-category.route";
import CategoryRouter from "../modules/Category/category.route";
import FollowerRouter from "../modules/Follower/follower.route";
import ShopRouter from "../modules/Shop/shop.router";
import ProductRouter from "../modules/Product/product.route";
import CouponRouter from "../modules/Coupon/coupon.router";
import OrderRouter from "../modules/Order/order.route";
import PaymentRouter from "../modules/Payment/payment.route";
import ProductReviewRouter from "../modules/ProductReview/product-review.route";

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
  // {
  //   path: "/coupons",
  //   router: CouponRouter,
  // },
  // {
  //   path: "/parent-categories",
  //   router: ParentCategoryRouter,
  // },
  {
    path: "/categories",
    router: CategoryRouter,
  },
  // {
  //   path: "/followers",
  //   router: FollowerRouter,
  // },
  // {
  //   path: "/orders",
  //   router: OrderRouter,
  // },
  // {
  //   path: "/product-reviews",
  //   router: ProductReviewRouter,
  // },
  // {
  //   path: "/payments",
  //   router: PaymentRouter,
  // },
];

const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;

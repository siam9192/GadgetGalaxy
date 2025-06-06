"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../modules/Auth/auth.route"));
const user_route_1 = __importDefault(require("../modules/User/user.route"));
const category_route_1 = __importDefault(require("../modules/Category/category.route"));
const product_route_1 = __importDefault(require("../modules/Product/product.route"));
const order_route_1 = __importDefault(require("../modules/Order/order.route"));
const payment_route_1 = __importDefault(require("../modules/Payment/payment.route"));
const cart_item_route_1 = __importDefault(require("../modules/CartItem/cart-item.route"));
const shipping_charge_route_1 = __importDefault(require("../modules/ShippingCharge/shipping-charge.route"));
const notification_route_1 = __importDefault(require("../modules/Notification/notification.route"));
const discount_route_1 = __importDefault(require("../modules/Discount/discount.route"));
const brand_route_1 = __importDefault(require("../modules/Brand/brand.route"));
const profile_route_1 = __importDefault(require("../modules/Profile/profile.route"));
const product_review_route_1 = __importDefault(require("../modules/ProductReview/product-review.route"));
const administratorActivityLog_route_1 = __importDefault(require("../modules/AdministratorActivityLog/administratorActivityLog.route"));
const overview_route_1 = __importDefault(require("../modules/Overview/overview.route"));
const wishListItem_route_1 = __importDefault(require("../modules/WishListItem/wishListItem.route"));
const util_route_1 = __importDefault(require("../modules/Util/util.route"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        router: auth_route_1.default,
    },
    {
        path: "/users",
        router: user_route_1.default,
    },
    {
        path: "/profile",
        router: profile_route_1.default,
    },
    {
        path: "/brands",
        router: brand_route_1.default,
    },
    {
        path: "/products",
        router: product_route_1.default,
    },
    {
        path: "/cart-items",
        router: cart_item_route_1.default,
    },
    {
        path: "/wishlist-items",
        router: wishListItem_route_1.default,
    },
    {
        path: "/discounts",
        router: discount_route_1.default,
    },
    {
        path: "/shipping-charges",
        router: shipping_charge_route_1.default,
    },
    {
        path: "/categories",
        router: category_route_1.default,
    },
    {
        path: "/orders",
        router: order_route_1.default,
    },
    {
        path: "/product-reviews",
        router: product_review_route_1.default,
    },
    {
        path: "/payments",
        router: payment_route_1.default,
    },
    {
        path: "/notifications",
        router: notification_route_1.default,
    },
    {
        path: "/administrator-activity-logs",
        router: administratorActivityLog_route_1.default,
    },
    {
        path: "/overview",
        router: overview_route_1.default,
    },
    {
        path: "/utils",
        router: util_route_1.default,
    },
];
const routes = moduleRoutes.map((route) => router.use(route.path, route.router));
exports.default = routes;

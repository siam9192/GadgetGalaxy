"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const constant_1 = require("../../utils/constant");
const getSearchKeywordResultsFromDB = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!keyword)
        return [];
    const categories = yield prisma_1.default.category.findMany({
        where: {
            name: {
                contains: keyword,
                mode: "insensitive",
            },
            isVisible: true,
        },
    });
    const categoriesData = categories.map((category) => ({
        id: category.id,
        name: category.name,
        imageUrl: category.imageUrl,
        slug: category.slug,
    }));
    const products = yield prisma_1.default.product.findMany({
        where: {
            name: {
                contains: keyword,
                mode: "insensitive",
            },
        },
        take: 12,
        select: constant_1.productSelect,
    });
    const productsData = products.map((product) => {
        const variant = product.variants[0];
        return {
            type: "product",
            name: product.name,
            imageUrl: product.images[0].url,
            price: (variant === null || variant === void 0 ? void 0 : variant.price) || product.price,
            offerPrice: (variant === null || variant === void 0 ? void 0 : variant.offerPrice) || product.offerPrice,
            rating: product.rating,
        };
    });
    const data = [];
    const tempData = [...productsData, ...categoriesData];
    for (const item of tempData) {
        const randomIndex = Math.floor(Math.random() * (data.length + 1));
        data.splice(randomIndex, 0, item); // insert at random position
    }
    return data;
});
const getMyUtilCountsFromDB = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {};
    if (authUser.role === client_1.UserRole.CUSTOMER) {
        const totalCartItems = yield prisma_1.default.cartItem.count({
            where: {
                customerId: authUser.customerId,
                product: {
                    status: client_1.ProductStatus.ACTIVE,
                },
            },
        });
        const totalWishListItems = yield prisma_1.default.wishListItem.count({
            where: {
                customerId: authUser.customerId,
                product: {
                    status: client_1.ProductStatus.ACTIVE,
                },
            },
        });
        data.cartItem = totalCartItems;
        data.wishListItem = totalWishListItems;
    }
    const totalNewNotifications = yield prisma_1.default.notification.count({
        where: {
            userId: authUser.id,
            isRead: false,
        },
    });
    return Object.assign(Object.assign({}, data), { newNotification: totalNewNotifications });
});
const UtilServices = {
    getSearchKeywordResultsFromDB,
    getMyUtilCountsFromDB,
};
exports.default = UtilServices;

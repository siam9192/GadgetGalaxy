"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesWithHierarchyStr = exports.isNumber = exports.getOrderStatusMessage = exports.convertExceptedDeliveryDate = exports.calculateDiscountPercentage = exports.generateTransactionId = exports.generateSlug = exports.generateOtp = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const generateOtp = () => {
    return crypto_1.default.randomInt(100000, 999999).toString();
};
exports.generateOtp = generateOtp;
function generateSlug(name) {
    return name
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .trim(); // Remove leading/trailing spaces
}
exports.generateSlug = generateSlug;
function generateTransactionId(length = 10) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let transactionId = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        transactionId += characters[randomIndex];
    }
    return transactionId;
}
exports.generateTransactionId = generateTransactionId;
const calculateDiscountPercentage = (price, offerPrice) => {
    if (!offerPrice)
        return 0;
    //  If regular price not equal with sale price then calculate discountPercentage and assign it
    const discountAmount = price - offerPrice;
    const discountPercentage = Math.floor((discountAmount / offerPrice) * 100);
    return discountPercentage;
};
exports.calculateDiscountPercentage = calculateDiscountPercentage;
const convertExceptedDeliveryDate = (rangeHours) => {
    if (rangeHours.includes("-")) {
        const [min, max] = rangeHours.split("");
        const from = new Date();
        from.setHours(from.getHours() + Number(min));
        const to = new Date();
        to.setHours(to.getHours() + Number(max));
        return {
            from,
            to,
        };
    }
    const inDate = new Date();
    inDate.setHours(inDate.getHours() + Number(rangeHours));
    return {
        in: inDate,
    };
};
exports.convertExceptedDeliveryDate = convertExceptedDeliveryDate;
function getOrderStatusMessage(status) {
    switch (status) {
        case client_1.OrderStatus.PENDING:
            return {
                title: "Your order is pending",
                message: "We have received your order and it is currently pending. We will notify you once it is processed.",
            };
        case client_1.OrderStatus.PLACED:
            return {
                title: "Your order has been placed",
                message: "Your order has been successfully placed. We will start processing it soon.",
            };
        case client_1.OrderStatus.PROCESSING:
            return {
                title: "Your order is being processed",
                message: "Your order is currently being prepared. We will update you once it is shipped.",
            };
        case client_1.OrderStatus.IN_TRANSIT:
            return {
                title: "Your order is on the way",
                message: "Good news! Your order has been shipped and is on its way to your address.",
            };
        case client_1.OrderStatus.DELIVERED:
            return {
                title: "Your order has been delivered",
                message: "Your order has been successfully delivered. We hope you enjoy your purchase!",
            };
        case client_1.OrderStatus.RETURNED:
            return {
                title: "Your order has been returned",
                message: "We have received your returned order. If you have any questions, please contact our support team.",
            };
        case client_1.OrderStatus.CANCELED:
            return {
                title: "Your order has been canceled",
                message: "Your order has been canceled. If this was a mistake or you need further assistance, please reach out to support.",
            };
        case client_1.OrderStatus.FAILED:
            return {
                title: "Your order failed",
                message: "Unfortunately, your order could not be processed. Please try again or contact support for assistance.",
            };
        default:
            return {
                title: "Order update",
                message: "There is an update regarding your order. Please check your order details.",
            };
    }
}
exports.getOrderStatusMessage = getOrderStatusMessage;
const isNumber = (num) => isNaN(parseInt(num));
exports.isNumber = isNumber;
function getCategoriesWithHierarchyStr(categories) {
    const convert = (c, ph = "") => {
        const hierarchyStr = [ph, c.hierarchyStr || c.slug].join("/");
        c.hierarchyStr = hierarchyStr;
        if (c.children && c.children.length) {
            c.children = c.children.map((_) => {
                return convert(_, hierarchyStr);
            });
        }
        return c;
    };
    return categories.map((_) => convert(_));
}
exports.getCategoriesWithHierarchyStr = getCategoriesWithHierarchyStr;

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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../helpers/paginationHelper");
const payment_service_1 = __importDefault(require("../Payment/payment.service"));
const function_1 = require("../../utils/function");
const notification_service_1 = __importDefault(require("../Notification/notification.service"));
const initOrderIntoDB = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItems = yield prisma_1.default.cartItem.findMany({
        where: {
            id: { in: payload.cartItemsId },
            product: { status: client_1.ProductStatus.ACTIVE },
        },
        include: {
            product: { include: { images: true } },
            variant: { include: { attributes: true } },
        },
    });
    if (cartItems.length !== payload.cartItemsId.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Item not found in cart");
    }
    const shippingCharge = yield prisma_1.default.shippingCharge.findUnique({
        where: { id: payload.shippingChargeId },
    });
    if (!shippingCharge) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Shipping charge not found");
    }
    const shippingAmount = shippingCharge.cost;
    // Map cart items for easier processing
    const items = cartItems.map((item) => {
        const variant = item.variant;
        const price = variant
            ? variant.offerPrice || variant.price
            : item.product.offerPrice || item.product.price;
        const quantity = item.quantity;
        return {
            productId: item.productId,
            variantId: item.variantId || null,
            productName: item.product.name,
            imageUrl: item.product.images[0].url,
            colorName: (variant === null || variant === void 0 ? void 0 : variant.colorName) || null,
            colorCode: (variant === null || variant === void 0 ? void 0 : variant.colorCode) || null,
            attributes: variant === null || variant === void 0 ? void 0 : variant.attributes,
            quantity,
            price,
            totalAmount: price * quantity,
        };
    });
    // **Check stock before reserving**
    for (const item of cartItems) {
        const availableQuantity = item.variant
            ? item.variant.availableQuantity
            : item.product.availableQuantity;
        if (availableQuantity < item.quantity) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Stock not available: ${item.product.name} (${item.quantity} requested, only ${availableQuantity} left)`);
        }
    }
    // **Calculate subtotal**
    const subTotal = items.reduce((p, c) => p + c.price * c.quantity, 0);
    let discountAmount = 0;
    if (payload.discountCode) {
        const discount = yield prisma_1.default.discount.findFirst({
            where: { code: payload.discountCode },
        });
        if (!discount)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Discount not found");
        if (discount.minOrderValue && discount.minOrderValue > subTotal) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Discount not applicable. Min order value: ${discount.minOrderValue}`);
        }
        discountAmount =
            discount.discountType === client_1.DiscountType.FIXED
                ? discount.discountValue
                : (discount.discountValue / 100) * subTotal;
    }
    const totalAmount = subTotal;
    const grossAmount = parseFloat((totalAmount - discountAmount).toFixed(2));
    const netAmount = grossAmount + shippingAmount;
    return yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
        // **Create Order**
        const createdOrder = yield txClient.order.create({
            data: {
                customerId: authUser.customerId,
                totalAmount,
                discountAmount,
                grossAmount,
                shippingAmount,
                netAmount,
                discountData: { code: payload.discountCode, discountAmount },
                shippingChargeData: {
                    id: shippingCharge.id,
                    title: shippingCharge.title,
                    description: shippingCharge.description,
                    cost: shippingCharge.cost,
                },
                notes: payload.notes,
                exceptedDeliveryDate: (0, function_1.convertExceptedDeliveryDate)(shippingCharge.deliveryHours),
                status: client_1.OrderStatus.PENDING,
                deletableCartItemsId: payload.removeCartItemsAfterPurchase
                    ? payload.cartItemsId.join(",")
                    : null,
            },
        });
        // **Reserve Stock**
        yield txClient.itemReserve.createMany({
            data: cartItems.map((item) => ({
                orderId: createdOrder.id,
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
            })),
        });
        // **Create Order Items**
        yield txClient.orderItem.createMany({
            data: items.map((item) => (Object.assign({ orderId: createdOrder.id }, item))),
        });
        const stockUpdatableVariants = cartItems
            .filter((_) => _.productId && _.variantId)
            .map((_) => ({ id: _.variantId, quantity: _.quantity }));
        const stockUpdatableProducts = cartItems
            .filter((_) => _.productId && !_.variantId)
            .map((_) => ({ id: _.productId, quantity: _.quantity }));
        yield Promise.all(stockUpdatableVariants.map((variant) => txClient.variant.update({
            where: { id: variant.id },
            data: { availableQuantity: { decrement: variant.quantity } },
        })));
        yield Promise.all(stockUpdatableProducts.map((product) => txClient.product.update({
            where: { id: product.id },
            data: { availableQuantity: { decrement: product.quantity } },
        })));
        // **Save Shipping Info**
        let _a = payload.shippingInfo, { address, addressId } = _a, otherShippingInfo = __rest(_a, ["address", "addressId"]);
        if (addressId) {
            const existingAddress = yield txClient.customerAddress.findUnique({
                where: { id: addressId },
            });
            if (!existingAddress)
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Address not found");
            address = {
                district: existingAddress.district,
                zone: existingAddress.zone,
                line: existingAddress.line,
            };
        }
        const shippingInfo = yield txClient.shippingInformation.create({
            data: Object.assign(Object.assign({ orderId: createdOrder.id }, otherShippingInfo), address),
        });
        // **Initialize Payment AFTER successful order creation**
        const { paymentId, paymentUrl } = yield payment_service_1.default.initPayment({
            method: client_1.PaymentMethod.SSLCOMMERZ,
            amount: grossAmount,
            customer: {
                name: shippingInfo.fullName,
                email: shippingInfo.emailAddress,
                phone: shippingInfo.phoneNumber,
            },
            shippingAddress: Object.values(address).join(","),
        });
        yield txClient.order.update({
            where: { id: createdOrder.id },
            data: { paymentId },
        });
        const productsId = cartItems.map((_) => _.productId);
        for (const pId of productsId) {
            const product = yield prisma_1.default.product.findUnique({
                where: {
                    id: pId,
                },
                select: {
                    id: true,
                    availableQuantity: true,
                    variants: true,
                },
            });
            if (!product)
                throw new Error();
            if (product.variants.length) {
                const availableQuantity = product.variants.reduce((p, c) => p + c.availableQuantity, 0);
                yield prisma_1.default.product.update({
                    where: {
                        id: pId,
                    },
                    data: {
                        availableQuantity,
                    },
                });
            }
        }
        return { paymentUrl };
    }));
});
const PlaceOrderIntoDB = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItems = yield prisma_1.default.cartItem.findMany({
        where: {
            id: { in: payload.cartItemsId },
            product: { status: client_1.ProductStatus.ACTIVE },
        },
        include: {
            product: { include: { images: true } },
            variant: { include: { attributes: true } },
        },
    });
    if (cartItems.length !== payload.cartItemsId.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Item not found in cart");
    }
    const shippingCharge = yield prisma_1.default.shippingCharge.findUnique({
        where: { id: payload.shippingChargeId },
    });
    if (!shippingCharge) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Shipping charge not found");
    }
    const shippingAmount = shippingCharge.cost;
    // Map cart items for easier processing
    const items = cartItems.map((item) => {
        const variant = item.variant;
        const price = variant
            ? variant.offerPrice || variant.price
            : item.product.offerPrice || item.product.price;
        const quantity = item.quantity;
        return {
            productId: item.productId,
            variantId: item.variantId || null,
            productName: item.product.name,
            imageUrl: item.product.images[0].url,
            colorName: (variant === null || variant === void 0 ? void 0 : variant.colorName) || null,
            colorCode: (variant === null || variant === void 0 ? void 0 : variant.colorCode) || null,
            attributes: variant === null || variant === void 0 ? void 0 : variant.attributes,
            quantity,
            price,
            totalAmount: price * quantity,
        };
    });
    // **Check stock before reserving**
    for (const item of cartItems) {
        const availableQuantity = item.variant
            ? item.variant.availableQuantity
            : item.product.availableQuantity;
        if (availableQuantity < item.quantity) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Stock not available: ${item.product.name} (${item.quantity} requested, only ${availableQuantity} left)`);
        }
    }
    // **Calculate subtotal**
    const subTotal = items.reduce((p, c) => p + c.price * c.quantity, 0);
    let discountAmount = 0;
    if (payload.discountCode) {
        const discount = yield prisma_1.default.discount.findFirst({
            where: { code: payload.discountCode },
        });
        if (!discount)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Discount not found");
        if (discount.minOrderValue && discount.minOrderValue > subTotal) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Discount not applicable. Min order value: ${discount.minOrderValue}`);
        }
        discountAmount =
            discount.discountType === client_1.DiscountType.FIXED
                ? discount.discountValue
                : (discount.discountValue / 100) * subTotal;
    }
    const totalAmount = subTotal;
    const grossAmount = parseFloat((totalAmount - discountAmount).toFixed(2));
    const netAmount = grossAmount + shippingAmount;
    return yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            customerId: authUser.customerId,
            totalAmount,
            discountAmount,
            grossAmount,
            shippingAmount,
            netAmount,
            discountData: { code: payload.discountCode, discountAmount },
            shippingChargeData: {
                id: shippingCharge.id,
                title: shippingCharge.title,
                description: shippingCharge.description,
                cost: shippingCharge.cost,
            },
            notes: payload.notes,
            exceptedDeliveryDate: (0, function_1.convertExceptedDeliveryDate)(shippingCharge.deliveryHours),
            status: client_1.OrderStatus.PLACED,
            deletableCartItemsId: payload.removeCartItemsAfterPurchase
                ? payload.cartItemsId.join(",")
                : null,
        };
        // **Create Order**
        const createdOrder = yield txClient.order.create({
            data: data,
        });
        // **Reserve Stock**
        yield txClient.itemReserve.createMany({
            data: cartItems.map((item) => ({
                orderId: createdOrder.id,
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
            })),
        });
        // **Create Order Items**
        yield txClient.orderItem.createMany({
            data: items.map((item) => (Object.assign({ orderId: createdOrder.id }, item))),
        });
        const stockUpdatableVariants = cartItems
            .filter((_) => _.productId && _.variantId)
            .map((_) => ({ id: _.variantId, quantity: _.quantity }));
        const stockUpdatableProducts = cartItems
            .filter((_) => _.productId && !_.variantId)
            .map((_) => ({ id: _.productId, quantity: _.quantity }));
        yield Promise.all(stockUpdatableVariants.map((variant) => txClient.variant.update({
            where: { id: variant.id },
            data: { availableQuantity: { decrement: variant.quantity } },
        })));
        yield Promise.all(stockUpdatableProducts.map((product) => txClient.product.update({
            where: { id: product.id },
            data: { availableQuantity: { decrement: product.quantity } },
        })));
        // **Save Shipping Info**
        // **Save Shipping Info**
        let _b = payload.shippingInfo, { address, addressId } = _b, otherShippingInfo = __rest(_b, ["address", "addressId"]);
        if (addressId) {
            const existingAddress = yield txClient.customerAddress.findUnique({
                where: { id: addressId },
            });
            if (!existingAddress)
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Address not found");
            address = {
                district: existingAddress.district,
                zone: existingAddress.zone,
                line: existingAddress.line,
            };
        }
        const shippingInfo = yield txClient.shippingInformation.create({
            data: Object.assign(Object.assign({ orderId: createdOrder.id }, otherShippingInfo), address),
        });
        // **Initialize Payment AFTER successful order creation**
        const { paymentId } = yield payment_service_1.default.initPayment({
            method: client_1.PaymentMethod.COD,
            amount: grossAmount,
            customer: {
                name: shippingInfo.fullName,
                email: shippingInfo.emailAddress,
                phone: shippingInfo.phoneNumber,
            },
            shippingAddress: Object.values(address).join(","),
        });
        yield txClient.order.update({
            where: { id: createdOrder.id },
            data: { paymentId },
        });
        const productsId = cartItems.map((_) => _.productId);
        for (const pId of productsId) {
            const product = yield prisma_1.default.product.findUnique({
                where: {
                    id: pId,
                },
                select: {
                    id: true,
                    availableQuantity: true,
                    variants: true,
                },
            });
            if (!product)
                throw new Error();
            if (product.variants.length) {
                const availableQuantity = product.variants.reduce((p, c) => p + c.availableQuantity, 0);
                yield prisma_1.default.product.update({
                    where: {
                        id: pId,
                    },
                    data: {
                        availableQuantity,
                    },
                });
            }
        }
        const deletableCartItemsId = createdOrder.deletableCartItemsId;
        // If deletable cart items exist then delete cart items from db
        if (deletableCartItemsId) {
            yield txClient.cartItem.deleteMany({
                where: {
                    id: {
                        in: deletableCartItemsId.split(","),
                    },
                },
            });
        }
        return null;
    }));
});
const placeOrderAfterSuccessfulPaymentIntoDB = (paymentId, tx) => __awaiter(void 0, void 0, void 0, function* () {
    yield tx.payment.update({
        where: {
            id: paymentId,
        },
        data: {
            status: client_1.PaymentStatus.SUCCESS,
        },
    });
    const updatedOrderData = yield tx.order.update({
        where: {
            paymentId: paymentId,
        },
        data: {
            status: client_1.OrderStatus.PLACED,
            paymentStatus: client_1.OrderPaymentStatus.PAID,
        },
    });
    const deletableCartItemsId = updatedOrderData.deletableCartItemsId;
    // If deletable cart items exist then delete cart items from db
    if (deletableCartItemsId) {
        yield tx.cartItem.deleteMany({
            where: {
                id: {
                    in: deletableCartItemsId.split(","),
                },
            },
        });
    }
});
const manageUnsuccessfulOrdersIntoDB = (status, id, tx) => __awaiter(void 0, void 0, void 0, function* () {
    yield tx.order.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    // Retrieve all reserved stock items for the failed order
    const reserves = yield tx.itemReserve.findMany({
        where: {
            orderId: id, // Get item reservations related to this order
            status: client_1.ItemReserveStatus.RESERVED,
        },
    });
    // Restore stock for non-variant products (simple products)
    yield Promise.all(reserves
        .filter((item) => item.productId && !item.variantId) // Only products without variants
        .map((item) => {
        return tx.product.updateMany({
            where: {
                id: item.productId, // Match product by ID
            },
            data: {
                availableQuantity: {
                    increment: item.quantity, // Restore reserved quantity
                },
            },
        });
    }));
    // Restore stock for variant products
    yield Promise.all(reserves
        .filter((item) => item.productId && item.variantId) // Only products with variants
        .map((item) => {
        return tx.variant.updateMany({
            where: {
                id: item.variantId, // Match variant by ID
            },
            data: {
                availableQuantity: {
                    increment: item.quantity, // Restore reserved quantity
                },
            },
        });
    }));
    // Update reserve status
    yield tx.itemReserve.updateMany({
        where: {
            orderId: id,
        },
        data: {
            status: client_1.ItemReserveStatus.RESTORED,
        },
    });
    const payment = yield tx.payment.findFirst({
        where: {
            order: {
                id,
            },
        },
    });
    const productsId = reserves.map((_) => _.productId);
    for (const pId of productsId) {
        const product = yield prisma_1.default.product.findUnique({
            where: {
                id: pId,
            },
            select: {
                id: true,
                availableQuantity: true,
                variants: true,
            },
        });
        if (!product)
            throw new Error();
        if (product.variants.length) {
            const availableQuantity = product.variants.reduce((p, c) => p + c.availableQuantity, 0);
            yield prisma_1.default.product.update({
                where: {
                    id: pId,
                },
                data: {
                    availableQuantity,
                },
            });
        }
    }
    if (payment && payment.status === client_1.PaymentStatus.SUCCESS) {
        yield tx.paymentRefundRequest.create({
            data: {
                paymentId: payment.id,
            },
        });
    }
});
const updateOrderStatusIntoDB = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma_1.default.order.findUnique({
        where: {
            id: payload.orderId,
        },
        include: {
            customer: true,
        },
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // If status and isNext is not exist in payload then throw error
    if (!payload.status && payload.isNext === undefined) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Something went wrong");
    }
    else if ([
        client_1.OrderStatus.PENDING,
        client_1.OrderStatus.FAILED,
        client_1.OrderStatus.DELIVERED,
        client_1.OrderStatus.CANCELED,
    ].includes(order.status)) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Order status update can not possible");
    }
    const nextStatus = {
        [client_1.OrderStatus.PLACED]: client_1.OrderStatus.PROCESSING,
        [client_1.OrderStatus.PROCESSING]: client_1.OrderStatus.IN_TRANSIT,
        [client_1.OrderStatus.IN_TRANSIT]: client_1.OrderStatus.DELIVERED,
    };
    //  If is next option is true then go to next order status
    if (payload.isNext) {
        const currentStatus = order.status;
        payload.status = nextStatus[currentStatus];
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.order.update({
            where: {
                id: payload.orderId,
            },
            data: {
                status: payload.status,
            },
            select: {
                id: true,
                status: true,
            },
        });
        if ([client_1.OrderStatus.CANCELED, client_1.OrderStatus.FAILED].includes(payload.status)) {
            yield manageUnsuccessfulOrdersIntoDB(payload.status, payload.orderId, tx);
        }
        yield tx.administratorActivityLog.create({
            data: {
                administratorId: authUser.administratorId,
                action: `Updated the order status ${order.status} to ${payload.status} orderId:${order.id}`,
            },
        });
    }));
    yield notification_service_1.default.createNotificationIntoDB(Object.assign(Object.assign({ usersId: [order.customer.userId] }, (0, function_1.getOrderStatusMessage)(payload.status)), { type: "ALERT" }));
    return result;
});
const cancelMyOrderIntoDB = (authUser, id) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const order = yield prisma_1.default.order.findUnique({
        where: {
            id,
            customerId: authUser.customerId,
        },
        select: {
            id: true,
            status: true,
            itemReserve: true,
        },
    });
    if (!order)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    if (order.status !== client_1.OrderStatus.PLACED) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Sorry order can not be possible ");
    }
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield manageUnsuccessfulOrdersIntoDB("CANCELED", id, tx);
        yield tx.notification.create({
            data: {
                userId: authUser.id,
                title: `You have canceled your order ID:${id}`,
                message: "Your order has been successfully canceled. If this was a mistake or you need assistance, please contact our support team.",
                type: "ORDER_STATUS",
            },
        });
    }));
});
const getOrdersForManageFromDB = (filter, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, status, customerId, orderId } = filter;
    const { skip, limit, page, sortOrder, orderBy } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    if (orderId && !Number.isNaN(orderId)) {
        andConditions.push({
            id: Number(orderId),
        });
    }
    else {
        if (startDate || endDate) {
            const validate = (date) => {
                return !isNaN(new Date(date).getTime());
            };
            if (startDate && validate(startDate) && endDate && validate(endDate)) {
                andConditions.push({
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                });
            }
            else if (startDate && validate(startDate)) {
                andConditions.push({
                    createdAt: {
                        gte: new Date(startDate),
                    },
                });
            }
            else if (endDate && validate(endDate)) {
                andConditions.push({
                    createdAt: {
                        lte: new Date(endDate),
                    },
                });
            }
        }
        // Add a condition to filter by order status if it's provided
        if (status) {
            andConditions.push({
                status, // Match orders with the given status
            });
        }
        if (customerId && !Number.isNaN(customerId)) {
            andConditions.push({
                customerId: Number(customerId),
            });
        }
    }
    const whereConditions = {
        status: {
            not: {
                in: [client_1.OrderStatus.PENDING, client_1.OrderStatus.FAILED],
            },
        },
        AND: andConditions,
    };
    const data = yield prisma_1.default.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        select: {
            id: true,
            customer: {
                select: {
                    id: true,
                    userId: true,
                    fullName: true,
                    profilePhoto: true,
                },
            },
            items: true,
            totalAmount: true,
            discountAmount: true,
            grossAmount: true,
            shippingAmount: true,
            netAmount: true,
            notes: true,
            exceptedDeliveryDate: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
            payment: true,
        },
        orderBy: {
            [orderBy]: sortOrder,
        },
    });
    const totalResult = yield prisma_1.default.order.count({
        where: whereConditions,
    });
    const total = yield prisma_1.default.order.count({
        where: {
            status: {
                not: {
                    in: [client_1.OrderStatus.PENDING, client_1.OrderStatus.FAILED],
                },
            },
        },
    });
    const meta = {
        limit,
        page,
        totalResult,
        total,
    };
    return {
        data,
        meta,
    };
});
const getMyOrdersFromDB = (authUser, filter, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, status } = filter;
    const { skip, limit, page, sortOrder, orderBy } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    if (startDate || endDate) {
        const validate = (date) => {
            return !isNaN(new Date(date).getTime());
        };
        if (startDate && validate(startDate) && endDate && validate(endDate)) {
            andConditions.push({
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            });
        }
        else if (startDate && validate(startDate)) {
            andConditions.push({
                createdAt: {
                    gte: new Date(startDate),
                },
            });
        }
        else if (endDate && validate(endDate)) {
            andConditions.push({
                createdAt: {
                    lte: new Date(endDate),
                },
            });
        }
    }
    // Add a condition to filter by order status if it's provided
    if (status) {
        andConditions.push({
            status, // Match orders with the given status
        });
    }
    const whereConditions = {
        customerId: authUser.customerId,
        status: {
            not: {
                in: [client_1.OrderStatus.PENDING, client_1.OrderStatus.FAILED],
            },
        },
        AND: andConditions,
    };
    console.log(orderBy, sortOrder);
    const orders = yield prisma_1.default.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        select: {
            id: true,
            items: true,
            totalAmount: true,
            discountAmount: true,
            grossAmount: true,
            shippingAmount: true,
            netAmount: true,
            notes: true,
            exceptedDeliveryDate: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
            payment: true,
        },
        orderBy: {
            [orderBy]: sortOrder,
        },
    });
    const data = orders.map((order) => {
        const _a = order.payment, { gatewayGatewayData } = _a, otherPData = __rest(_a, ["gatewayGatewayData"]);
        return Object.assign(Object.assign({}, order), { payment: otherPData });
    });
    const totalResult = yield prisma_1.default.order.count({
        where: whereConditions,
    });
    const total = yield prisma_1.default.order.count({
        where: {
            status: {
                not: {
                    in: [client_1.OrderStatus.PENDING, client_1.OrderStatus.FAILED],
                },
            },
            customerId: authUser.customerId,
        },
    });
    const meta = {
        limit,
        page,
        totalResult,
        total,
    };
    return {
        data,
        meta,
    };
});
const getMyOrderByIdFromDB = (authUser, id) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const order = yield prisma_1.default.order.findUnique({
        where: {
            id,
            status: {
                not: {
                    in: [client_1.OrderStatus.PENDING, client_1.OrderStatus.FAILED],
                },
            },
        },
        select: {
            id: true,
            customer: true,
            items: true,
            totalAmount: true,
            discountAmount: true,
            grossAmount: true,
            shippingAmount: true,
            netAmount: true,
            shippingChargeData: true,
            shippingInfo: true,
            notes: true,
            exceptedDeliveryDate: true,
            status: true,
            paymentStatus: true,
            payment: true,
            createdAt: true,
        },
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    return order;
});
const getOrderByIdForManageFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const order = yield prisma_1.default.order.findUnique({
        where: {
            id,
            status: {
                not: {
                    in: [client_1.OrderStatus.PENDING, client_1.OrderStatus.FAILED],
                },
            },
        },
        select: {
            id: true,
            customer: {
                select: {
                    id: true,
                    userId: true,
                    fullName: true,
                    profilePhoto: true,
                },
            },
            items: true,
            totalAmount: true,
            discountAmount: true,
            grossAmount: true,
            shippingAmount: true,
            netAmount: true,
            shippingChargeData: true,
            shippingInfo: true,
            notes: true,
            exceptedDeliveryDate: true,
            status: true,
            paymentStatus: true,
            payment: true,
            createdAt: true,
        },
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    return order;
});
const getRecentOrdersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    const endDate = new Date();
    const orders = yield prisma_1.default.order.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        select: {
            id: true,
            customer: {
                select: {
                    id: true,
                    fullName: true,
                    profilePhoto: true,
                },
            },
            items: true,
            totalAmount: true,
            discountAmount: true,
            grossAmount: true,
            shippingAmount: true,
            netAmount: true,
            notes: true,
            exceptedDeliveryDate: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
        },
        take: 6,
        orderBy: {
            createdAt: "desc",
        },
    });
    return orders;
});
const getNotReviewedOrderItemsFromDB = (authUser, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const data = yield prisma_1.default.orderItem.findMany({
        where: {
            order: {
                customerId: authUser.customerId,
                status: client_1.OrderStatus.DELIVERED,
            },
            isReviewed: false,
        },
        skip,
        take: limit,
    });
    return data;
});
const getStockOutProductsFromDB = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const whereConditions = {
        OR: [
            {
                availableQuantity: 0,
            },
            {
                variants: {
                    some: {
                        availableQuantity: 0,
                    },
                },
            },
        ],
    };
    const { skip, limit, page } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const products = yield prisma_1.default.product.findMany({
        where: whereConditions,
        include: {
            variants: {
                where: {
                    availableQuantity: 0,
                },
            },
        },
        skip,
        take: limit,
    });
    const data = products.map((product) => {
        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            offerPrice: product.price,
            variants: product.variants,
        };
    });
    const totalResult = prisma_1.default.product.count({ where: whereConditions });
    const meta = {
        page,
        limit,
        totalResult,
    };
    return {
        data,
        meta,
    };
});
const OrderServices = {
    initOrderIntoDB,
    placeOrderAfterSuccessfulPaymentIntoDB,
    PlaceOrderIntoDB,
    manageUnsuccessfulOrdersIntoDB,
    getMyOrdersFromDB,
    getOrdersForManageFromDB,
    getStockOutProductsFromDB,
    getOrderByIdForManageFromDB,
    getMyOrderByIdFromDB,
    getNotReviewedOrderItemsFromDB,
    cancelMyOrderIntoDB,
    updateOrderStatusIntoDB,
    getRecentOrdersFromDB,
};
exports.default = OrderServices;

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
const paginationHelper_1 = require("../../helpers/paginationHelper");
const createNotificationIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
        const { usersId } = payload;
        if (payload.usersId && payload.usersId.length) {
            for (let i = 0; i < usersId.length; i++) {
                yield txClient.notification.create({
                    data: {
                        userId: usersId[i],
                        type: payload.type,
                        title: payload.title,
                        message: payload.message,
                        imageUrl: payload.imageUrl,
                    },
                });
            }
        }
        else {
            const users = yield prisma_1.default.user.findMany({
                where: {
                    role: client_1.UserRole.CUSTOMER,
                    status: client_1.UserStatus.ACTIVE,
                },
                select: {
                    id: true,
                },
            });
            yield Promise.all(users.map((user) => {
                return txClient.notification.create({
                    data: {
                        userId: user.id,
                        type: payload.type,
                        title: payload.title,
                        message: payload.message,
                        imageUrl: payload.imageUrl,
                    },
                });
            }));
        }
    }));
});
const getNotificationsFromDB = (filter, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page, orderBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const { userId, type, startDate, endDate } = filter;
    const andConditions = [];
    if (userId) {
        andConditions.push({
            userId: Number(userId),
        });
    }
    if (type) {
        andConditions.push({
            type,
        });
    }
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
        else if (startDate && !isNaN(new Date(startDate).getTime())) {
            andConditions.push({
                createdAt: {
                    gte: new Date(startDate),
                },
            });
        }
        else if (endDate && !isNaN(new Date(endDate).getTime())) {
            andConditions.push({
                createdAt: {
                    lte: new Date(endDate),
                },
            });
        }
    }
    const whereConditions = {
        AND: andConditions,
    };
    const data = yield prisma_1.default.notification.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [orderBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.notification.count({
        where: whereConditions,
    });
    const meta = {
        limit,
        page,
        total,
    };
    return {
        data,
        meta,
    };
});
const getMyNotificationsFromDB = (authUser, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page, orderBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const data = yield prisma_1.default.notification.findMany({
        where: {
            userId: authUser.id,
        },
        skip,
        take: limit,
        orderBy: {
            [orderBy]: sortOrder,
        },
    });
    const totalResult = yield prisma_1.default.notification.count({
        where: {
            userId: authUser.id,
        },
    });
    const meta = {
        limit,
        page,
        totalResult,
    };
    return {
        data,
        meta,
    };
});
const notificationsSetAsReadIntoDB = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.notification.updateMany({
        where: {
            userId: authUser.id,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
    return null;
});
const NotificationServices = {
    createNotificationIntoDB,
    getNotificationsFromDB,
    getMyNotificationsFromDB,
    notificationsSetAsReadIntoDB,
};
exports.default = NotificationServices;

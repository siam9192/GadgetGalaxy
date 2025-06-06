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
const paginationHelper_1 = require("../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const getActivityLogsFromDB = (authUser, filter, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { administratorId, startDate, endDate } = filter;
    const { skip, limit, page, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
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
    if (administratorId) {
        andConditions.push({
            administratorId,
        });
    }
    const whereConditions = {
        AND: andConditions,
    };
    const data = yield prisma_1.default.administratorActivityLog.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            createdAt: sortOrder,
        },
    });
    const totalResult = yield prisma_1.default.administratorActivityLog.count({
        where: whereConditions,
    });
    const total = yield prisma_1.default.administratorActivityLog.count();
    const meta = {
        page,
        limit,
        totalResult,
        total,
    };
    return {
        data,
        meta,
    };
});
const getAdministratorActivities = (id, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, page, limit, sortOrder, orderBy } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const logs = yield prisma_1.default.administratorActivityLog.findMany({
        where: {
            administratorId: Number(id),
        },
        take: limit,
        skip,
        orderBy: {
            [orderBy]: sortOrder,
        },
    });
    const totalResult = yield prisma_1.default.administratorActivityLog.count({
        where: {
            administratorId: Number(id),
        },
    });
    const data = logs;
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
const deleteActivityFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = yield prisma_1.default.administratorActivityLog.findUnique({
        where: {
            id,
        },
    });
    if (!activity) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Activity not found");
    }
    yield prisma_1.default.administratorActivityLog.delete({
        where: {
            id,
        },
    });
    return null;
});
const ActivityLogServices = {
    getActivityLogsFromDB,
    deleteActivityFromDB,
    getAdministratorActivities,
};
exports.default = ActivityLogServices;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePagination = void 0;
const util_interface_1 = require("../interfaces/util.interface");
const calculatePagination = (options) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 12;
    const sortOrder = Object.values(util_interface_1.ESortOrder).includes(options.sortOrder)
        ? options.sortOrder
        : util_interface_1.ESortOrder.DESC;
    const orderBy = options.orderBy || "createdAt";
    const skip = (page - 1) * limit;
    return {
        page,
        limit,
        skip,
        sortOrder,
        orderBy,
    };
};
exports.calculatePagination = calculatePagination;

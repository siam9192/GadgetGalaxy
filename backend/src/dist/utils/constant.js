"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSelect = exports.administratorRoles = exports.allRoles = exports.paginationOptionKeys = void 0;
const client_1 = require("@prisma/client");
exports.paginationOptionKeys = ["page", "limit", "orderBy", "sortOrder"];
exports.allRoles = Object.values(client_1.UserRole);
exports.administratorRoles = [
    client_1.UserRole.SUPER_ADMIN,
    client_1.UserRole.ADMIN,
    client_1.UserRole.MODERATOR,
];
exports.productSelect = {
    id: true,
    name: true,
    description: true,
    sku: true,
    slug: true,
    price: true,
    offerPrice: true,
    discountPercentage: true,
    rating: true,
    availableQuantity: true,
    variants: {
        select: {
            id: true,
            sku: true,
            price: true,
            offerPrice: true,
            availableQuantity: true,
            isHighlighted: true,
            attributes: true,
        },
        take: 1,
    },
    images: true,
};

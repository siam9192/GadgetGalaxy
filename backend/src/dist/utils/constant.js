"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSelect =
  exports.allRoles =
  exports.paginationOptionKeys =
    void 0;
const client_1 = require("@prisma/client");
exports.paginationOptionKeys = ["page", "limit", "orderBy", "sortOrder"];
exports.allRoles = Object.values(client_1.UserRole);
exports.productSelect = {
  id: true,
  name: true,
  description: true,
  sku: true,
  slug: true,
  price: true,
  offerPrice: true,
  rating: true,
  availableQuantity: true,
  variants: {
    select: {
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

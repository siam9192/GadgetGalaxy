import { UserRole } from "@prisma/client";

export const paginationOptionKeys = ["page", "limit", "orderBy", "sortOrder"];

export const allRoles = Object.values(UserRole);
export const administratorRoles = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MODERATOR,
];

export const productSelect = {
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

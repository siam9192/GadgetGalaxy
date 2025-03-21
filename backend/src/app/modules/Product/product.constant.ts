import { Prisma } from "@prisma/client";

export const productsSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  slug: true,
  brand: true,
  regularPrice: true,
  salePrice: true,
  discountPercentage: true,
  stock: true,
  rating: true,
  category: {
    select: {
      name: true,
    },
  },
  images: true,
  variants: {
    where: {
      isHighlighted: true,
    },
    take: 1,
  },
};

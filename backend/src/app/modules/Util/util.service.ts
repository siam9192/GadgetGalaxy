import { ProductStatus, UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
import { productSelect } from "../../utils/constant";
import { IAuthUser } from "../Auth/auth.interface";

const getSearchKeywordResultsFromDB = async (keyword: string) => {
  if (!keyword) return [];
  const categories = await prisma.category.findMany({
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
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: keyword,
        mode: "insensitive",
      },
    },
    take: 12,
    select: productSelect,
  });

  const productsData = products.map((product) => {
    const variant = product.variants[0];
    return {
      type: "product",
      name: product.name,
      imageUrl: product.images[0].url,
      price: variant?.price || product.price,
      offerPrice: variant?.offerPrice || product.offerPrice,
      rating: product.rating,
    };
  });

  const data: any[] = [];
  const tempData = [...productsData, ...categoriesData];

  for (const item of tempData) {
    const randomIndex = Math.floor(Math.random() * (data.length + 1));
    data.splice(randomIndex, 0, item); // insert at random position
  }

  return data;
};

const getMyUtilCountsFromDB = async (authUser: IAuthUser) => {
  const data: Record<string, number> = {};
  if (authUser.role === UserRole.CUSTOMER) {
    const totalCartItems = await prisma.cartItem.count({
      where: {
        customerId: authUser.customerId,
        product: {
          status: ProductStatus.ACTIVE,
        },
      },
    });

    const totalWishListItems = await prisma.wishListItem.count({
      where: {
        customerId: authUser.customerId,
        product: {
          status: ProductStatus.ACTIVE,
        },
      },
    });
    data.cartItem = totalCartItems;
    data.wishListItem = totalWishListItems;
  }
  const totalNewNotifications = await prisma.notification.count({
    where: {
      userId: authUser.id,
      isRead: false,
    },
  });
  return {
    ...data,
    newNotification: totalNewNotifications,
  };
};

const UtilServices = {
  getSearchKeywordResultsFromDB,
  getMyUtilCountsFromDB,
};

export default UtilServices;

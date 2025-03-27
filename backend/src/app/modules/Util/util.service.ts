import prisma from "../../shared/prisma";
import { productSelect } from "../../utils/constant";

const getSearchKeywordResultsFromDB = async (keyword: string) => {
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
      imageUr: product.images[0],
      price: variant.price || product.price,
      offerPrice: variant.offerPrice || product.offerPrice,
    };
  });
};

const UtilServices = {
  getSearchKeywordResultsFromDB,
};

export default UtilServices;

import { Prisma, Product, ProductImage, Variant } from "@prisma/client";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { IAuthUser } from "../Auth/auth.interface";
import {
  ICreateProductPayload,
  IProductFilterData,
  IUpdateProductPayload,
} from "./product.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import { generateSlug } from "../../utils/function";
import { productsSelect } from "./product.constant";

const createProductIntoDB = async (payload: ICreateProductPayload) => {
  // if variant not exist then  default Regular price and sale price is required
  if (
    !payload.variants.length &&
    (!payload.salePrice || !payload.regularPrice)
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "regular price and sale price is required",
    );
  }

  const category = prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  //  Shop doesn't exist
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category  not found");
  }
  let slug = generateSlug(payload.name);
  // Generate unique slug
  let counter = 1;
  do {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });
    if (!product) {
      break;
    }
    counter++;
    slug = generateSlug(payload.name + " " + counter);
  } while (true);

  const productData: any = {
    name: payload.name,
    slug,
    sku: payload.sku,
    description: payload.description,
    categoryId: payload.categoryId,
    regularPrice: payload.regularPrice,
    salePrice: payload.salePrice,
    discountPercentage: 0,
    stock: payload.stock,
  };

  const { regularPrice, salePrice, images, tags, variants, specification } =
    payload;

  if (variants.length) {
    delete productData.regularPrice;
    delete productData.salePrice;
    delete productData.discountPercentage;
    delete productData.stock;
  } else if (regularPrice && salePrice) {
    // Checking is the sale price getter than regular price
    if (regularPrice < salePrice) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Sale price can not be getter then regular price",
      );
    }

    //  If regular price not equal with sale price then calculate discountPercentage and assign it
    if (regularPrice !== salePrice) {
      const discountAmount = regularPrice - salePrice;
      productData.discountPercentage = Math.floor(
        (discountAmount / regularPrice) * 100,
      );
    }
  }

  const result = await prisma.$transaction(async (txClient) => {
    const createdProductData = await txClient.product.create({
      data: productData,
    });

    if (variants && variants.length) {
      variants.forEach(async (item) => {
        if (item.salePrice > item.regularPrice) {
          throw new AppError(
            httpStatus.NOT_ACCEPTABLE,
            "Item sale price can not be getter regular price",
          );
        }

        let itemDiscountPercentage = 0;
        let itemDiscountAmount = 0;
        //  If regular price not equal with sale price then calculate discountPercentage and assign it
        if (item.regularPrice !== item.salePrice) {
          itemDiscountAmount = item.regularPrice - item.salePrice;
          itemDiscountPercentage = Math.floor(
            (itemDiscountAmount / item.regularPrice) * 100,
          );
        }

        const { attributes, ...other } = item;
        const data = {
          productId: createdProductData.id,
          ...other,
          discountPercentage: itemDiscountPercentage,
        };

        const createdVariant = await txClient.variant.create({
          data,
        });

        if (attributes && attributes.length) {
          const x = await txClient.variantAttribute.createMany({
            data: attributes.map((item) => ({
              variantId: createdVariant.id,
              ...item,
            })),
          });
        }
      });
    }

    // If product tags exist then insert it into db
    if (tags && tags.length) {
      await txClient.productTag.createMany({
        data: tags.map((ele) => ({
          productId: createdProductData.id,
          name: ele,
        })),
      });
    }

    // if product specification exist then insert it into db
    if (specification && specification.length) {
      await txClient.productSpecification.createMany({
        data: specification.map((item) => ({
          productId: createdProductData.id,
          ...item,
        })),
      });
    }

    await txClient.productImage.createMany({
      data: images.map((ele) => ({
        productId: createdProductData.id,
        url: ele,
      })),
    });

    return await txClient.product.findUnique({
      where: {
        id: createdProductData.id,
      },
      include: {
        images: true,
        variants: {
          include: {
            attributes: true,
          },
        },
        tags: true,
        category: true,
      },
    });
  });

  return result;
};

const updateProductIntoDB = async (payload: IUpdateProductPayload) => {
  const product = await prisma.product.findUnique({
    where: {
      id: payload.id,
    },
  });

  // Checking product existence
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
    }
  }

  const {
    id: productId,
    specification,
    variants,
    deletedVariantAttributesId,
    specifications,
    images,
    tags,
    regularPrice,
    salePrice,
    ...othersData
  } = payload;

  const finalData: any = {
    ...othersData,
  };

  if (!(regularPrice && salePrice)) {
    const variants = payload.variants.filter(
      (item) =>
        item.isNewAdded === true || (item.id && item.isDeleted === false),
    );

    if (!variants.length) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Product Price error!!.regular price and sale price is required when product have no variant",
      );
    }
  } else {
    // Checking is the sale price getter than regular price
    if (regularPrice < salePrice) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Product Price error!.Sale price can not be getter then regular price",
      );
    }

    //  If regular price not equal with sale price then calculate discountPercentage and assign it
    if (regularPrice !== salePrice) {
      const discountAmount = regularPrice - salePrice;
      finalData.discountPercentage = Math.floor(
        (discountAmount / regularPrice) * 100,
      );
    }

    finalData.regularPrice = regularPrice;
    finalData.salePrice = salePrice;
  }

  const result = await prisma.$transaction(async (txClient) => {
    // Update product into db
    const updatedProduct = await txClient.product.update({
      where: {
        id: payload.id,
      },
      data: finalData,
    });

    //Filter Deleted variants ids
    const deletedSpecificationItemIds = specification
      .filter((item) => item.id && item.isDeleted)
      .map((item) => item.id!);

    // If deleted variants exist then delete tags from database
    if (deletedSpecificationItemIds.length) {
      await prisma.productSpecification.deleteMany({
        where: {
          id: {
            in: deletedSpecificationItemIds,
          },
        },
      });
    }

    //Filter Deleted variants ids
    const deletedVariantsId = variants
      .filter((item) => item.id && item.isDeleted)
      .map((item) => item.id!);

    // If deleted variants exist then delete tags from database
    if (variants.length) {
      await prisma.variant.deleteMany({
        where: {
          id: {
            in: deletedVariantsId,
          },
        },
      });
    }

    // If deleted variant attribute exist then delete it from db
    if (deletedVariantAttributesId && deletedVariantAttributesId.length) {
      await txClient.variantAttribute.deleteMany({
        where: {
          id: {
            in: deletedVariantAttributesId,
          },
        },
      });
    }

    // deleted images ids
    const deletedImagesId = images
      .filter((item) => item.id && item.isDeleted)
      .map((item) => item.id!);
    // If deleted images exist then delete tags from database
    if (deletedImagesId.length) {
      await txClient.productImage.deleteMany({
        where: {
          id: {
            in: deletedImagesId,
          },
        },
      });
    }

    const deletedTagsId = tags
      .filter((item) => item.id && item.isDeleted)
      .map((item) => item.id!);
    // If deleted tags exist then delete tags from database
    if (deletedTagsId.length) {
      await txClient.productTag.deleteMany({
        where: {
          id: {
            in: deletedTagsId,
          },
        },
      });
    }

    // Filter new added images from images
    const newAddedVariants = variants.filter((item) => item.isNewAdded);

    // If new added images exist then insert into db
    if (newAddedVariants.length) {
      // Price check
      newAddedVariants.forEach(async (item) => {
        if (item.salePrice > item.regularPrice) {
          throw new AppError(
            httpStatus.NOT_ACCEPTABLE,
            "Item sale price can not be getter regular price",
          );
        }

        let itemDiscountPercentage = 0;
        let itemDiscountAmount = 0;
        //  If regular price not equal with sale price then calculate discountPercentage and assign it
        if (item.regularPrice !== item.salePrice) {
          itemDiscountAmount = item.regularPrice - item.salePrice;
          itemDiscountPercentage = Math.floor(
            (itemDiscountAmount / item.regularPrice) * 100,
          );
        }

        const { attributes, ...other } = item;

        // Variant data
        const data = {
          productId,
          ...other,
          discountPercentage: itemDiscountPercentage,
        };

        // Create variant
        const createdVariant = await txClient.variant.create({
          data,
        });

        // If variant attributes exits then insert it
        if (attributes && attributes.length) {
          const x = await txClient.variantAttribute.createMany({
            data: attributes.map((item) => ({
              variantId: createdVariant.id,
              ...item,
            })),
          });
        }
      });
    }

    // Filter new added images from images
    const newAddedImages = images
      .filter((item) => item.isNewAdded)
      .map((item) => ({
        productId,
        url: item.url,
      }));

    // If new added variants exist then insert into db
    if (newAddedImages.length) {
      await txClient.productImage.createMany({
        data: newAddedImages,
      });
    }

    // Filter new added images from images
    const newAddedTags = tags
      .filter((item) => item.isNewAdded)
      .map((item) => ({
        name: item.name,
        productId,
      }));
    // If new added tags exist then insert into db
    if (newAddedTags.length) {
      await txClient.productTag.createMany({
        data: newAddedTags,
      });
    }

    // Filter updatable variant
    const updatableVariants = variants.filter(
      (item) => item.id && !item.isDeleted && !item.isNewAdded,
    );
    if (updatableVariants.length) {
      updatableVariants.forEach(async (item) => {
        if (item.salePrice > item.regularPrice) {
          throw new AppError(
            httpStatus.NOT_ACCEPTABLE,
            "Item sale price can not be getter regular price",
          );
        }
        let itemDiscountPercentage = 0;
        let itemDiscountAmount = 0;
        //  If regular price not equal with sale price then calculate discountPercentage and assign it
        if (item.regularPrice !== item.salePrice) {
          itemDiscountAmount = item.regularPrice - item.salePrice;
          itemDiscountPercentage = Math.floor(
            (itemDiscountAmount / item.regularPrice) * 100,
          );
        }
        await txClient.variant.update({
          where: {
            id: item.id,
          },
          data: {
            sku: item.sku,
            colorName: item.colorName,
            colorCode: item.colorCode,
            salePrice: item.salePrice,
            regularPrice: item.regularPrice,
            discountPercentage: itemDiscountPercentage,
            stock: item.stock,
            isHighlighted: item.isHighlighted,
          },
        });

        if (item.attributes && item.attributes.length) {
          item.attributes.forEach(async (attribute) => {
            await txClient.variantAttribute.update({
              where: {
                id: attribute.id,
              },
              data: attribute,
            });
          });
        }
      });
    }

    // Filter updatable images
    const updatableImages = images.filter(
      (item) => item.id && !item.isDeleted && !item.isNewAdded,
    );

    // Update images
    if (updatableImages.length) {
      updatableImages.forEach(async (item) => {
        await txClient.productImage.updateMany({
          where: {
            id: item.id!,
          },
          data: {
            url: item.url,
          },
        });
      });
    }

    // Filter updatable images
    const updatableTags = tags.filter(
      (item) => item.id && !item.isDeleted && !item.isNewAdded,
    );

    //  Update tags

    if (updatableImages.length) {
      updatableTags.forEach(async (item) => {
        await txClient.productTag.updateMany({
          where: {
            id: item.id!,
          },
          data: {
            name: item.name,
          },
        });
      });
    }

    return await txClient.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        tags: true,
        images: true,
      },
    });
  });
};

const getRecentlyViewedProductsFromDB = async (
  authUser: IAuthUser,
  ids: string,
) => {
  let products: any[];
  if (authUser) {
    const recentViewedProducts = await prisma.recentView.findMany({
      where: {
        customerId: authUser.customerId,
      },
      take: 12,
      select: {
        product: {
          select: productsSelect,
        },
      },
    });
    products = recentViewedProducts.map((item) => item.product);
  } else {
    try {
      const productIds = ids.split(",");
      products = await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });
    } catch (error) {
      products = [];
    }
  }
  return products;
};

const getProductsFromDB = async (
  filterData: IProductFilterData,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, categories, brands, minPrice, maxPrice } = filterData;

  const { limit, skip, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.ProductWhereInput[] = [];

  if (categories) {
    const categoriesSlug = categories.split(",");
    if (categoriesSlug.length) {
      andConditions.push({
        slug: {
          in: categoriesSlug,
        },
      });
    }
  }

  if (brands) {
    const brandsName = brands.split(",");
    if (brandsName.length) {
      andConditions.push({
        brand: {
          name: {
            in: brandsName,
          },
        },
      });
    }
  }

  // If search term exist then search data by search term
  if (searchTerm) {
    const searchableFields = ["name", "description"];
    andConditions.push({
      OR: [
        ...searchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
        {
          tags: {
            some: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }
 
    
  
  const include:Prisma.ProductInclude   =  {
    category: {
      select: {
        name: true,
      },
    },
     // Default where
    variants:{
      where:{
        isHighlighted:true
      },
      take:1
    },
    images: true,
  }

  // If minimum price and max price exist then filter by price range
  if (minPrice && maxPrice && parseInt(minPrice) && parseInt(maxPrice)) {
    andConditions.push({
      OR: [
        {
          salePrice: {
            gt: parseInt(minPrice),
            lt:parseInt(maxPrice)
          },
        },
        {
          variants: {
            some: {
              salePrice: {
                gt: parseInt(minPrice),
                lt:parseInt(maxPrice)
              },
            },
          },
        },
      ],
    });
    include.variants = {
      where:{
        salePrice: {
          gt: parseInt(minPrice),
          lt:parseInt(maxPrice)
        },
      },
      take:1
    }
  }
 else  {
  // If only minimum price exist
  if (minPrice && parseInt(minPrice)) {

    andConditions.push({
      OR: [
        {
          salePrice: {
            gt: parseInt(minPrice),
          },
        },
        {
          variants: {
            some: {
              salePrice: {
                gt: parseInt(minPrice),
              },
            },
          },
        },
      ],
    });
    include.variants = {
      where:{
        salePrice: {
          gt: parseInt(minPrice),
        },
      },
      take:1
    }
   
  }
  // If only maximum price exist
  else if (maxPrice && parseInt(maxPrice)){
   
      andConditions.push({
        OR: [
          {
            salePrice: {
              lt: parseInt(maxPrice),
            },
          },
          {
            variants: {
              some: {
                salePrice: {
                  lt: parseInt(maxPrice),
                },
              },
            },
          },
        ],
      });

      include.variants = {
        where:{
          salePrice: {
            lt: parseInt(maxPrice),
          },
        },
        take:1
  }

 }
}


  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
  };
 
  const data = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
    include 
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });
  return {
    data,
    meta: {
      total,
      limit,
      page,
    },
  };
}

const getRelatedProductsByProductSlugFromDB = async (productSlug: string) => {
  const product = await prisma.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      variants: true,
    },
  });

  //  Checking product existence
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const { brandId, categoryId, rating } = product;

  const products = await prisma.product.findMany({
    where: {
      id: {
        not: product.id,
      },
      categoryId,
      brandId,
    },
    select: productsSelect,
    take: 6,
  });
  return products;
};

const getProductBySlugForCustomerViewFromDB = async (
  authUser: IAuthUser,
  slug: string,
) => {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      category: true,
      specification: true,
      variants: {
        include: {
          attributes: true,
        },
      },
      tags: true,
    },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  if (authUser) {
    // Upsert viewed product into customer recent views
    await prisma.recentView.upsert({
      where: {
        customerId_productId: {
          customerId: authUser.customerId!,
          productId: product.id,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        customerId: authUser.customerId!,
        productId: product.id,
      },
    });

    // Increment product views count1
    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });
  }

  return product;
};

const getRecommendedProductsFromDB = async (authUser?: IAuthUser) => {
  if (!authUser) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Auth user is required");
  }
  const recentViews = await prisma.recentView.findMany({
    where: {
      customerId: authUser.customerId,
    },
    include: {
      product: true,
    },
  });

  const categoriesId = recentViews.map((item) => item.product.categoryId);
  const brandsId = recentViews
    .map((item) => item.product.brandId)
    .filter((id) => id !== null);
  const minRating = Math.min(...recentViews.map((item) => item.product.rating));
  const maxRating = Math.max(...recentViews.map((item) => item.product.rating));

  const products = await prisma.product.findMany({
    where: {
      category: {
        id: {
          in: categoriesId,
        },
      },

      rating: {
        gte: minRating,
        lte: maxRating,
      },
    },
    take: 12,
    select: productsSelect,
  });

  const productsByBrand = await prisma.product.findMany({
    where: {
      id: {
        notIn: products.map((item) => item.id),
      },
      brandId: {
        in: brandsId,
      },
    },
    take: 12,
    select: productsSelect,
  });
  const concatData = products.concat(productsByBrand);

  const data: any[] = [];

  //Random indexing
  concatData.forEach((item) => {
    let isSet: boolean = false;
    while (isSet === false) {
      const index = Math.round(Math.random() * concatData.length);
      if (data[index]) {
        continue;
      } else {
        data[index] = item;
        isSet = true;
      }
    }
  });
  return data;
};

const getFeaturedProductsFromDB = async (
  paginationOptions: IPaginationOptions,
) => {
  const { page, skip, limit, sortOrder, orderBy } =
    calculatePagination(paginationOptions);
  const products = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });
  const total = await prisma.product.count({
    where: {
      isFeatured: true,
    },
  });
  const meta = {
    limit,
    page,
    total,
  };

  return {
    data: products,
    meta,
  };
};

const deleteProductFromDB = async (productId: string) => {
  await prisma.product.delete({
    where: {
      id: productId,
    },
  });
  return null;
};

const getMyProductsFromDB = async (
  authUser: IAuthUser,
  filterData: IProductFilterData,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, categories } = filterData;

  const { limit, skip, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.ProductWhereInput[] = [];

  if (categories) {
    const categoriesSlug = categories.split(",");
    if (categoriesSlug.length) {
      andConditions.push({
        slug: {
          in: categoriesSlug,
        },
      });
    }
  }

  if (searchTerm) {
    const searchableFields = ["name", "description"];
    andConditions.push({
      OR: [
        ...searchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
        {
          tags: {
            some: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
  };

  const data = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },

    include: {
      category: {
        select: {
          name: true,
        },
      },
      images: true,
    },
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });
  return {
    meta: {
      total,
      limit,
      page,
    },
    data,
  };
};

const SoftDeleteProductFromDB = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
      status: "Deleted",
    },
  });

  if (!product) throw new AppError(httpStatus.NOT_FOUND, "Product not found");

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      status: "Deleted",
    },
  });
};

const ProductServices = {
  createProductIntoDB,
  updateProductIntoDB,
  deleteProductFromDB,
  getFeaturedProductsFromDB,
  getProductsFromDB,
  getProductBySlugForCustomerViewFromDB,
  getRelatedProductsByProductSlugFromDB,
  getRecentlyViewedProductsFromDB,
  getMyProductsFromDB,
  getRecommendedProductsFromDB,
};

export default ProductServices;

import { OrderStatus, Prisma, ProductStatus } from "@prisma/client";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { IAuthUser } from "../Auth/auth.interface";
import {
  ICreateProductPayload,
  IFilterBrandProductQuery,
  IFilterCategoryProductQuery,
  IManageProductsFilterQuery,
  ISearchProductsFilterQuery,
  IUpdateProductPayload,
  IUpdateProductStockPayload,
} from "./product.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import {
  calculateDiscountPercentage,
  generateSlug,
} from "../../utils/function";
import { productSelect } from "../../utils/constant";
import { ICategoryFilterRequest } from "../Category/category.interface";

const createProductIntoDB = async (payload: ICreateProductPayload) => {
  const { imagesUrl, variants, categoriesId, specifications } = payload;

  // Validate product pricing
  if (payload.offerPrice && payload.offerPrice >= payload.price) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Offer price can not be getter than or equal price",
    );
  }

  // Validate variant pricing
  if (variants && variants.length) {
    variants.forEach((variant) => {
      if (variant.offerPrice && variant.offerPrice >= payload.price) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          "Variant Offer price can not be getter than or equal price",
        );
      }
    });
  }

  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: categoriesId,
      },
    },
  });

  if (categories.length !== categoriesId.length) {
    throw new AppError(httpStatus.NOT_FOUND, `Category not found`);
  }

  let slug = generateSlug(payload.name);
  let counter = 1;
  while (
    await prisma.product.findUnique({ where: { slug }, select: { id: true } })
  ) {
    slug = generateSlug(`${payload.name} ${counter++}`);
  }

  // If variant exist the highlighted variant price will be set as product default price  set with available quantity
  if (variants && variants.length) {
    const highlightedVariant =
      variants.find((_) => _.isHighlighted) || variants[0];
    payload.price = highlightedVariant.price;
    payload.offerPrice = highlightedVariant.offerPrice || payload.offerPrice;
    payload.availableQuantity = variants.reduce(
      (p, c) => p + c.availableQuantity,
      0,
    );
  }

  const productData: any = {
    name: payload.name,
    slug,
    brandId: payload.brandId,
    sku: payload.sku,
    description: payload.description,
    warrantyInfo: payload.warrantyInfo,
    price: payload.price,
    offerPrice: payload.offerPrice,
    discountPercentage: calculateDiscountPercentage(
      payload.price,
      payload.offerPrice,
    ),
    availableQuantity: payload.availableQuantity,
  };

  // Use transaction
  const result = await prisma.$transaction(async (txClient) => {
    const createdProductData = await txClient.product.create({
      data: productData,
    });

    // Create product category
    await txClient.productCategory.createMany({
      data: payload.categoriesId.map((id) => ({
        productId: createdProductData.id,
        categoryId: id,
      })),
    });

    // if product variant exist then insert it into db
    if (variants && variants.length) {
      for (let i = 0; i < variants.length; i++) {
        const { attributes, ...variant } = variants[i];
        // Insert variant fist after insert variant attributes
        const createdVariant = await txClient.variant.create({
          data: {
            productId: createdProductData.id,
            ...variant,
            discountPercentage: calculateDiscountPercentage(
              variant.price,
              variant.offerPrice,
            ),
            isHighlighted: variants.find((_) => _.isHighlighted)
              ? true
              : i === 0
                ? true
                : false,
          },
        });
        await txClient.variantAttribute.createMany({
          data: attributes.map((_) => ({
            variantId: createdVariant.id,
            ..._,
          })),
        });
      }
    }

    // if product specification exist then insert it into db
    if (specifications && specifications.length) {
      await txClient.productSpecification.createMany({
        data: specifications.map((item) => ({
          productId: createdProductData.id,
          name: item.name,
          value: item.name,
        })),
      });
    }

    // Insert image urls
    await txClient.productImage.createMany({
      data: imagesUrl.map((ele) => ({
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
        categories: true,
      },
    });
  });

  return result;
};

const updateProductIntoDB = async (
  id: string | number,
  payload: IUpdateProductPayload,
) => {
  id = Number(id);
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  // Checking product existence
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const { categoriesId, imagesUrl, variants, specifications, brandId } =
    payload;

  // Validations
  if (!payload.variants) {
    if (payload.price && !payload.offerPrice) {
      if (product.offerPrice && payload.price <= product.offerPrice) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          "Offer price can not be getter than or equal main price",
        );
      }
    }
  }
  if (
    payload.brandId &&
    !(await prisma.brand.findUnique({
      where: { id },
    }))
  ) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }

  if (imagesUrl && (imagesUrl.length < 2 || imagesUrl.length > 10)) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Minimum 2 and maximum 10 image is required",
    );
  }

  if (specifications && !specifications.length) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Minimum 1 specs is required",
    );
  }

  // Variants

  // Set pricing
  if (variants) {
    if (variants?.filter((_) => !_.isDeleted).length) {
      // Check price
      variants
        .filter((_) => !_.isDeleted)
        .forEach((variant) => {
          if (variant.offerPrice) {
            if (variant.offerPrice >= variant.price)
              throw new AppError(
                httpStatus.NOT_ACCEPTABLE,
                "Variant offer price can not be getter than or equal of main price",
              );
          }
        });

      const highlightedVariant = variants
        .filter((_) => !_.isDeleted)
        .find((_) => _.isHighlighted);
      if (highlightedVariant) {
        payload.price = highlightedVariant.price;
        payload.offerPrice =
          highlightedVariant.offerPrice || payload.offerPrice;
        payload.availableQuantity = variants.reduce(
          (p, c) => p + c.availableQuantity,
          0,
        );
      }

      // Add available quantity
      payload.availableQuantity = variants
        .filter((_) => !_.isDeleted)
        .reduce((p, c) => p + c.availableQuantity, 0);
    }
  }

  const result = await prisma.$transaction(async (txClient) => {
    //  Update primary data
    await txClient.product.update({
      where: {
        id,
      },
      data: {
        name: payload.name,
        description: payload.description,
        warrantyInfo: payload.warrantyInfo,
        brandId: payload.brandId,
        price: payload.price,
        offerPrice: payload.offerPrice,
        availableQuantity: payload.availableQuantity,
      },
    });

    // Manage images url

    if (imagesUrl && imagesUrl.length) {
      // First delete all images
      await txClient.productImage.deleteMany({
        where: {
          productId: id,
        },
      });
      // Second insert images url that payload contains
      await txClient.productImage.createMany({
        data: imagesUrl.map((url) => ({
          url,
          productId: id,
        })),
      });
    }

    // Manage Categories

    // First delete product categories
    await txClient.productCategory.deleteMany({
      where: {
        productId: id,
      },
    });

    if (categoriesId && categoriesId.length) {
      // Second insert categories  id that payload contains
      await txClient.productCategory.createMany({
        data: categoriesId.map((id) => ({
          categoryId: id,
          productId: id,
        })),
      });
    }
    if (specifications && specifications.length) {
      // Manage Specifications

      // First delete all  specifications
      await txClient.productSpecification.deleteMany({
        where: {
          productId: id,
        },
      });

      // Second insert all  specifications
      await txClient.productSpecification.createMany({
        data: specifications.map((spec) => ({
          productId: id,
          ...spec,
        })),
      });
    }
    if (variants && variants.length) {
      const deletedVariantsId = variants
        .filter((_) => _.isDeleted === true && _.id)
        .map((_) => _.id!);

      // Delete variants if exist
      if (deletedVariantsId.length) {
        await txClient.variant.deleteMany({
          where: {
            id: {
              in: deletedVariantsId,
            },
          },
        });
      }
      const newAddedVariants = variants.filter((_) => !_.id && !_.isDeleted);

      // Insert new added variants
      if (newAddedVariants.length) {
        for (const variant of newAddedVariants) {
          const { attributes, isDeleted, id: varId, ...others } = variant;
          // Insert variant
          const createdVariant = await txClient.variant.create({
            data: {
              productId: id as number,
              ...others,
              discountPercentage: calculateDiscountPercentage(
                others.price,
                others.offerPrice,
              ),
            },
          });
          //  Insert variant attributes
          await txClient.variantAttribute.createMany({
            data: attributes.map((att) => ({
              variantId: createdVariant.id,
              ...att,
            })),
          });
        }
      }

      const updatedVariants = variants.filter((_) => _.id && !_.isDeleted);

      if (updatedVariants.length) {
        for (const variant of updatedVariants) {
          const { id, isDeleted, attributes, ...other } = variant;
          await txClient.variant.update({
            where: {
              id: id,
            },
            data: other,
          });

          await txClient.variantAttribute.deleteMany({
            where: {
              variantId: id,
            },
          });

          await txClient.variantAttribute.createMany({
            data: attributes.map((att) => {
              return {
                variantId: id!,
                ...att,
              };
            }),
          });
        }
      }
      const updatedProduct = await txClient.product.findUnique({
        where: {
          id,
        },
        select: {
          variants: true,
        },
      });

      return await txClient.product.findUnique({
        where: {
          id,
        },
        include: {
          variants: {
            include: {
              attributes: true,
            },
          },
          categories: true,
          specifications: true,
          images: true,
        },
      });
    }
  });
  return result;
};

const getRecentlyViewedProductsFromDB = async (
  authUser: IAuthUser,
  ids: string,
) => {
  const productsId = ids
    .split(",")
    .filter((_) => !Number.isNaN(_))
    .map((_) => parseInt(_));
  let wishListedProductIds: number[] = [];

  if (authUser) {
    const wishListedItems = await prisma.wishListItem.findMany({
      where: {
        customerId: authUser.customerId,
      },
    });

    wishListedItems.forEach((item) =>
      wishListedProductIds.push(item.productId),
    );
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productsId,
      },
      status: ProductStatus.ACTIVE,
    },
    select:productSelect
  });

  const data = products.map((product) => {
    // Calculate stock
    product.availableQuantity = product.variants.length ? product.variants.reduce(
      (p, c) => p + c.availableQuantity,
      0,
    ):product.availableQuantity;
    // Shot description
    product.description = product.description.slice(0, 300);
    product.variants = product.variants.filter(
      (variant) => variant.isHighlighted,
    );
    const upd = {
      ...product,
      isWishListed: wishListedProductIds.includes(product.id),
    };

    return upd;
  });

  return data;
};

const getSearchProductsFromDB = async (
  filterQuery: ISearchProductsFilterQuery,
  paginationOptions: IPaginationOptions,
  authUser?: IAuthUser,
) => {
  const { page, limit, skip, orderBy, sortOrder } =
    calculatePagination(paginationOptions);
  const andConditions: Prisma.ProductWhereInput[] = [];
  const { searchTerm, minPrice, maxPrice, category, brand } = filterQuery;

  if (searchTerm) {
    andConditions.push({
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    });
  }

  // Add category on category existence
  if (category) {
    andConditions.push({
      categories: {
        some: {
          category: {
            slug: category,
          },
        },
      },
    });
  }

  // Add brand on  existence
  if (brand) {
    andConditions.push({
      brand: {
        name: brand,
      },
    });
  }

  const validateNumber = (number: string) => {
    return !isNaN(parseInt(number));
  };
  // If minimum price and max price exist then filter by price range
  if (
    minPrice &&
    maxPrice &&
    validateNumber(minPrice) &&
    validateNumber(maxPrice)
  ) {
    andConditions.push({
      OR: [
        {
          OR: [
            {
              price: {
                gt: parseInt(minPrice),
                lt: parseInt(maxPrice),
              },
              offerPrice: null,
            },
            {
              offerPrice: {
                gt: parseInt(minPrice),
                lt: parseInt(maxPrice),
              },
            },
          ],
        },
        {
          variants: {
            some: {
              OR: [
                {
                  price: {
                    gt: parseInt(minPrice),
                    lt: parseInt(maxPrice),
                  },
                  offerPrice: null,
                },
                {
                  offerPrice: {
                    gt: parseInt(minPrice),
                    lt: parseInt(maxPrice),
                  },
                },
              ],
            },
          },
        },
      ],
    });
  } else {
    // If only minimum price exist
    if (minPrice && validateNumber(minPrice)) {
      andConditions.push({
        OR: [
          {
            OR: [
              {
                price: {
                  gt: parseInt(minPrice),
                },
                offerPrice: null,
              },
              {
                offerPrice: {
                  gt: parseInt(minPrice),
                },
              },
            ],
          },
          {
            variants: {
              some: {
                OR: [
                  {
                    price: {
                      gt: parseInt(minPrice),
                    },
                    offerPrice: null,
                  },
                  {
                    offerPrice: {
                      gt: parseInt(minPrice),
                    },
                  },
                ],
              },
            },
          },
        ],
      });
    }
    // If only maximum price exist
    else if (maxPrice && validateNumber(maxPrice)) {
      andConditions.push({
        OR: [
          {
            OR: [
              {
                price: {
                  lt: parseInt(maxPrice),
                },
                offerPrice: null,
              },
              {
                offerPrice: {
                  lt: parseInt(maxPrice),
                },
              },
            ],
          },
          {
            variants: {
              some: {
                OR: [
                  {
                    price: {
                      lt: parseInt(maxPrice),
                    },
                    offerPrice: null,
                  },
                  {
                    offerPrice: {
                      lt: parseInt(maxPrice),
                    },
                  },
                ],
              },
            },
          },
        ],
      });
    }
  }

  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
    status: ProductStatus.ACTIVE,
    availableQuantity: {
      gt: 0,
    },
  };

  const products = await prisma.product.findMany({
    where: whereConditions,
    orderBy:
      orderBy === "price"
        ? [
            { offerPrice: sortOrder }, // NULLs first by default
            { price: sortOrder },
          ]
        : {
            [orderBy]: sortOrder,
          },
    select: productSelect,
    take: limit,
    skip,
  });

  const wishListedProductIds: number[] = [];
  if (authUser) {
    const wishListedItems = await prisma.wishListItem.findMany({
      where: {
        customerId: authUser.customerId,
      },
    });

    wishListedItems.forEach((item) =>
      wishListedProductIds.push(item.productId),
    );
  }

  const data = products.map((product) => {
    // Calculate stock
    product.availableQuantity = product.variants.length ? product.variants.reduce(
      (p, c) => p + c.availableQuantity,
      0,
    ):product.availableQuantity;
    // Shot description
    product.description = product.description.slice(0, 300);
    product.variants = product.variants.filter(
      (variant) => variant.isHighlighted,
    );
    const upd = {
      ...product,
      isWishListed: wishListedProductIds.includes(product.id),
    };

    return upd;
  });
  const total = await prisma.product.count({
    where: { status: ProductStatus.ACTIVE },
  });
  const totalResult = await prisma.product.count({ where: whereConditions });

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
};

const getProductsForManageFromDB = async (
  filterData: IManageProductsFilterQuery,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, category, brand, minPrice, maxPrice } = filterData;

  const { limit, skip, page, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.ProductWhereInput[] = [];

  if (category && !Number.isNaN(category)) {
    andConditions.push({
      categories: {
        some: {
          categoryId: Number(category),
        },
      },
    });
  }

  if (brand && !Number.isNaN(brand)) {
    andConditions.push({
      brandId: Number(brand),
    });
  }

  // If search term exist then search data by search term
  if (searchTerm && !Number.isNaN(searchTerm)) {
    andConditions.push({
      id: Number(searchTerm),
    });
  } else {
    if (searchTerm) {
      andConditions.push({
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      });
    }
  }

  const validateNumber = (number: string) => {
    return !isNaN(parseInt(number));
  };
  // If minimum price and max price exist then filter by price range
  if (
    minPrice &&
    maxPrice &&
    validateNumber(minPrice) &&
    validateNumber(maxPrice)
  ) {
    andConditions.push({
      OR: [
        {
          OR: [
            {
              price: {
                gt: parseInt(minPrice),
                lt: parseInt(maxPrice),
              },
              offerPrice: null,
            },
            {
              offerPrice: {
                gt: parseInt(minPrice),
                lt: parseInt(maxPrice),
              },
            },
          ],
        },
        {
          variants: {
            some: {
              OR: [
                {
                  price: {
                    gt: parseInt(minPrice),
                    lt: parseInt(maxPrice),
                  },
                  offerPrice: null,
                },
                {
                  offerPrice: {
                    gt: parseInt(minPrice),
                    lt: parseInt(maxPrice),
                  },
                },
              ],
            },
          },
        },
      ],
    });
  } else {
    // If only minimum price exist
    if (minPrice && validateNumber(minPrice)) {
      andConditions.push({
        OR: [
          {
            OR: [
              {
                price: {
                  gt: parseInt(minPrice),
                },
                offerPrice: null,
              },
              {
                offerPrice: {
                  gt: parseInt(minPrice),
                },
              },
            ],
          },
          {
            variants: {
              some: {
                OR: [
                  {
                    price: {
                      gt: parseInt(minPrice),
                    },
                    offerPrice: null,
                  },
                  {
                    offerPrice: {
                      gt: parseInt(minPrice),
                    },
                  },
                ],
              },
            },
          },
        ],
      });
    }
    // If only maximum price exist
    else if (maxPrice && validateNumber(maxPrice)) {
      andConditions.push({
        OR: [
          {
            OR: [
              {
                price: {
                  lt: parseInt(maxPrice),
                },
                offerPrice: null,
              },
              {
                offerPrice: {
                  lt: parseInt(maxPrice),
                },
              },
            ],
          },
          {
            variants: {
              some: {
                OR: [
                  {
                    price: {
                      lt: parseInt(maxPrice),
                    },
                    offerPrice: null,
                  },
                  {
                    offerPrice: {
                      lt: parseInt(maxPrice),
                    },
                  },
                ],
              },
            },
          },
        ],
      });
    }
  }

  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
    status: {
      not: ProductStatus.DELETED,
    },
    availableQuantity: {
      gt: 0,
    },
  };

  const data = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      brand: true,
      images: true,
      categories: true,
      availableQuantity: true,
      variants: {
        where: {
          isHighlighted: true,
        },
        include: {
          attributes: true,
        },
        take: 0,
      },
      _count: {
        select: {
          reviews: true,
          orders: {
            where: {
              order: {
                status: OrderStatus.DELIVERED,
              },
            },
          },
          variants: true,
        },
      },
    },
  });

  const totalResult = await prisma.product.count({
    where: whereConditions,
  });

  const total = await prisma.product.count({
    where: {
      status: {
        not: ProductStatus.DELETED,
      },
    },
  });
  return {
    data,
    meta: {
      totalResult,
      total,
      limit,
      page,
    },
  };
};

const getRelatedProductsByProductSlugFromDB = async (
  productSlug: string,
  authUser?: IAuthUser,
) => {
  
  const product = await prisma.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      categories: true,
      variants: true,
    },
  });

  //  Checking product existence
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const { categories, name } = product;

  const whereConditions: Prisma.ProductWhereInput = {
    id: {
      not: product.id,
    },
    OR: [
      {
        categories: {
          some: {
            categoryId: {
              in: categories.map((_) => _.categoryId),
            },
          },
        },
      },
      {
        OR: name.split(" ").map((_) => ({
          name: {
            contains: _,
            mode: "insensitive",
          },
        })),
      },
    ],
  };

  const wishListedProductIds: number[] = [];
  if (authUser) {
    const wishListedItems = await prisma.wishListItem.findMany({
      where: {
        customerId: authUser.customerId,
      },
    });

    wishListedItems.forEach((item) =>
      wishListedProductIds.push(item.productId),
    );
  }

  const products = await prisma.product.findMany({
    where: whereConditions,
    select: productSelect,
    take: 6,
  });

  const data = products.map((product) => {
    // Calculate stock
    product.availableQuantity = product.variants.length ? product.variants.reduce(
      (p, c) => p + c.availableQuantity,
      0,
    ):product.availableQuantity;
    // Shot description
    product.description = product.description.slice(0, 300);
    product.variants = product.variants.filter(
      (variant) => variant.isHighlighted,
    );
    const upd = {
      ...product,
      isWishListed: wishListedProductIds.includes(product.id),
    };

    return upd;
  });

  return data;
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
      categories: true,
      specifications: true,
      variants: {
        include: {
          attributes: true,
        },
      },
      images:true
    },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  let isWishListed = false;
  if (authUser) {
    isWishListed = (await prisma.wishListItem.findUnique({
      where: {
        productId_customerId: {
          customerId: authUser.customerId!,
          productId: product.id,
        },
      },
    }))
      ? true
      : false;
  }

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

  return { ...product, isWishListed };
};

const getFeaturedProductsFromDB = async (
  paginationOptions: IPaginationOptions,
  authUser?: IAuthUser,
) => {
  const { page, skip, limit, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  const products = await prisma.product.findMany({
    where: {
      isFeatured: true,
      status: ProductStatus.ACTIVE,
      availableQuantity: {
        gt: 0,
      },
    },
    select: productSelect,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const wishListedProductIds: number[] = [];
  if (authUser) {
    const wishListedItems = await prisma.wishListItem.findMany({
      where: {
        customerId: authUser.customerId,
      },
    });

    wishListedItems.forEach((item) =>
      wishListedProductIds.push(item.productId),
    );
  }
  const data = products.map((product) => {
    // Calculate stock
    product.availableQuantity = product.variants.length ? product.variants.reduce(
      (p, c) => p + c.availableQuantity,
      0,
    ):product.availableQuantity;
    // Shot description
    product.description = product.description.slice(0, 300);
    product.variants = product.variants.filter(
      (variant) => variant.isHighlighted,
    );
    const upd = {
      ...product,
      isWishListed: wishListedProductIds.includes(product.id),
    };

    return upd;
  });

  
  const totalResult = await prisma.product.count({
    where: {
      isFeatured: true,
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
};
const getNewArrivalProductsFromDB = async (
  paginationOptions: IPaginationOptions,
  authUser: IAuthUser,
) => {
  const { page, skip, limit, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  const whereConditions = {
    status: ProductStatus.ACTIVE,
    availableQuantity: {
      gt: 0,
    },
  };
  const products = await prisma.product.findMany({
    where: whereConditions,
    select: productSelect,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const wishListedProductIds: number[] = [];
  if (authUser) {
    const wishListedItems = await prisma.wishListItem.findMany({
      where: {
        customerId: authUser.customerId,
      },
    });

    wishListedItems.forEach((item) =>
      wishListedProductIds.push(item.productId),
    );
  }



  const data = products.map((product) => {
    // Calculate stock
    product.availableQuantity = product.variants.length ? product.variants.reduce(
      (p, c) => p + c.availableQuantity,
      0,
    ):product.availableQuantity;
    // Shot description
    product.description = product.description.slice(0, 300);
    product.variants = product.variants.filter(
      (variant) => variant.isHighlighted,
    );
    const upd = {
      ...product,
      isWishListed: wishListedProductIds.includes(product.id),
    };

    return upd;
  });

  const totalResult = await prisma.product.count({
    where: whereConditions,
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
};

const getStockOutProductsFromDB = async (
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip, sortOrder, orderBy } =
    calculatePagination(paginationOptions);

  const whereConditions: Prisma.ProductWhereInput = {
    OR: [
      {
        availableQuantity: 0,
      },
      {
        variants: {
          some: {
            availableQuantity: 0,
          },
        },
      },
    ],
  };
  const products = await prisma.product.findMany({
    where: whereConditions,
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      offerPrice: true,
      images: true,
      availableQuantity: true,
      variants: {
        where: {
          availableQuantity: 0,
        },
        include: {
          attributes: true,
        },
      },
    },
    orderBy:
      orderBy === "price"
        ? [{ offerPrice: sortOrder }, { price: sortOrder }]
        : {
            [orderBy]: sortOrder,
          },

    take: limit,
    skip,
  });

  const totalResult = await prisma.product.count({ where: whereConditions });

  const data = products;
  const meta = {
    page,
    limit,
    totalResult,
  };

  return {
    data,
    meta,
  };
};

const getCategoryProductsFromDB = async (
  slug: string,
  filterQuery: IFilterCategoryProductQuery,
  paginationOptions: IPaginationOptions,
  authUser: IAuthUser,
) => {
  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found");

  const { page, limit, skip, orderBy, sortOrder } =
    calculatePagination(paginationOptions);
  const andConditions: Prisma.ProductWhereInput[] = [];
  const { minPrice, maxPrice, brand } = filterQuery;

  // Add category on category existence
  if (category) {
    andConditions.push({
      categories: {
        some: {
          category: {
            slug,
          },
        },
      },
    });
  }

  // Add brand on  existence
  if (brand) {
    andConditions.push({
      brand: {
        name: brand,
      },
    });
  }

  const validateNumber = (number: string) => {
    return !isNaN(parseInt(number));
  };
  // If minimum price and max price exist then filter by price range
  if (
    minPrice &&
    maxPrice &&
    validateNumber(minPrice) &&
    validateNumber(maxPrice)
  ) {
    andConditions.push({
      OR: [
        {
          OR: [
            {
              price: {
                gt: parseInt(minPrice),
                lt: parseInt(maxPrice),
              },
              offerPrice: null,
            },
            {
              offerPrice: {
                gt: parseInt(minPrice),
                lt: parseInt(maxPrice),
              },
            },
          ],
        },
        {
          variants: {
            some: {
              OR: [
                {
                  price: {
                    gt: parseInt(minPrice),
                    lt: parseInt(maxPrice),
                  },
                  offerPrice: null,
                },
                {
                  offerPrice: {
                    gt: parseInt(minPrice),
                    lt: parseInt(maxPrice),
                  },
                },
              ],
            },
          },
        },
      ],
    });
  } else {
    // If only minimum price exist
    if (minPrice && validateNumber(minPrice)) {
      andConditions.push({
        OR: [
          {
            OR: [
              {
                price: {
                  gt: parseInt(minPrice),
                },
                offerPrice: null,
              },
              {
                offerPrice: {
                  gt: parseInt(minPrice),
                },
              },
            ],
          },
          {
            variants: {
              some: {
                OR: [
                  {
                    price: {
                      gt: parseInt(minPrice),
                    },
                    offerPrice: null,
                  },
                  {
                    offerPrice: {
                      gt: parseInt(minPrice),
                    },
                  },
                ],
              },
            },
          },
        ],
      });
    }
    // If only maximum price exist
    else if (maxPrice && validateNumber(maxPrice)) {
      andConditions.push({
        OR: [
          {
            OR: [
              {
                price: {
                  lt: parseInt(maxPrice),
                },
                offerPrice: null,
              },
              {
                offerPrice: {
                  lt: parseInt(maxPrice),
                },
              },
            ],
          },
          {
            variants: {
              some: {
                OR: [
                  {
                    price: {
                      lt: parseInt(maxPrice),
                    },
                    offerPrice: null,
                  },
                  {
                    offerPrice: {
                      lt: parseInt(maxPrice),
                    },
                  },
                ],
              },
            },
          },
        ],
      });
    }
  }

  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
    status: ProductStatus.ACTIVE,
    availableQuantity: {
      gt: 0,
    },
  };

  const products = await prisma.product.findMany({
    where: whereConditions,
    orderBy:
      orderBy === "price"
        ? [
            { offerPrice: sortOrder }, // NULLs first by default
            { price: sortOrder },
          ]
        : {
            [orderBy]: sortOrder,
          },
    select:productSelect,
    take: limit,
    skip,
  });

  const wishListedProductIds: number[] = [];
  if (authUser) {
    const wishListedItems = await prisma.wishListItem.findMany({
      where: {
        customerId: authUser.customerId,
      },
    });

    wishListedItems.forEach((item) =>
      wishListedProductIds.push(item.productId),
    );
  }

  const data = products.map((product) => {
    // Calculate stock
    product.availableQuantity = product.variants.length ? product.variants.reduce(
      (p, c) => p + c.availableQuantity,
      0,
    ):product.availableQuantity;
    // Shot description
    product.description = product.description.slice(0, 300);
    product.variants = product.variants.filter(
      (variant) => variant.isHighlighted,
    );
    const upd = {
      ...product,
      isWishListed: wishListedProductIds.includes(product.id),
    };

    return upd;
  });
  const total = await prisma.product.count({
    where: { status: ProductStatus.ACTIVE },
  });
  const totalResult = await prisma.product.count({ where: whereConditions });

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
};

const getBrandProductsFromDB = async (
  name: string,
  filterQuery: IFilterBrandProductQuery,
  paginationOptions: IPaginationOptions,
  authUser: IAuthUser,
) => {
  const brand = await prisma.brand.findUnique({
    where: {
     name,
    },
  });

  if (!brand) throw new AppError(httpStatus.NOT_FOUND, "Brand not found");

  const { page, limit, skip, orderBy, sortOrder } =
    calculatePagination(paginationOptions);
  const andConditions: Prisma.ProductWhereInput[] = [];
  const { minPrice, maxPrice,category } = filterQuery;

  // Add category on category existence
  if (category) {
    andConditions.push({
      categories: {
        some: {
          category: {
            slug:category,
          },
        },
      },
    });
  }

  // Add brand on  existence
  if (brand) {
    andConditions.push({
      brand: {
        name
      },
    });
  }

  const validateNumber = (number: string) => {
    return !isNaN(parseInt(number));
  };
  // If minimum price and max price exist then filter by price range
  if (
    minPrice &&
    maxPrice &&
    validateNumber(minPrice) &&
    validateNumber(maxPrice)
  ) {
    andConditions.push({
      OR: [
        {
          OR: [
            {
              price: {
                gt: parseInt(minPrice),
                lt: parseInt(maxPrice),
              },
              offerPrice: null,
            },
            {
              offerPrice: {
                gt: parseInt(minPrice),
                lt: parseInt(maxPrice),
              },
            },
          ],
        },
        {
          variants: {
            some: {
              OR: [
                {
                  price: {
                    gt: parseInt(minPrice),
                    lt: parseInt(maxPrice),
                  },
                  offerPrice: null,
                },
                {
                  offerPrice: {
                    gt: parseInt(minPrice),
                    lt: parseInt(maxPrice),
                  },
                },
              ],
            },
          },
        },
      ],
    });
  } else {
    // If only minimum price exist
    if (minPrice && validateNumber(minPrice)) {
      andConditions.push({
        OR: [
          {
            OR: [
              {
                price: {
                  gt: parseInt(minPrice),
                },
                offerPrice: null,
              },
              {
                offerPrice: {
                  gt: parseInt(minPrice),
                },
              },
            ],
          },
          {
            variants: {
              some: {
                OR: [
                  {
                    price: {
                      gt: parseInt(minPrice),
                    },
                    offerPrice: null,
                  },
                  {
                    offerPrice: {
                      gt: parseInt(minPrice),
                    },
                  },
                ],
              },
            },
          },
        ],
      });
    }
    // If only maximum price exist
    else if (maxPrice && validateNumber(maxPrice)) {
      andConditions.push({
        OR: [
          {
            OR: [
              {
                price: {
                  lt: parseInt(maxPrice),
                },
                offerPrice: null,
              },
              {
                offerPrice: {
                  lt: parseInt(maxPrice),
                },
              },
            ],
          },
          {
            variants: {
              some: {
                OR: [
                  {
                    price: {
                      lt: parseInt(maxPrice),
                    },
                    offerPrice: null,
                  },
                  {
                    offerPrice: {
                      lt: parseInt(maxPrice),
                    },
                  },
                ],
              },
            },
          },
        ],
      });
    }
  }

  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
    status: ProductStatus.ACTIVE,
    availableQuantity: {
      gt: 0,
    },
  };

  const products = await prisma.product.findMany({
    where: whereConditions,
    orderBy:
      orderBy === "price"
        ? [
            { offerPrice: sortOrder }, // NULLs first by default
            { price: sortOrder },
          ]
        : {
            [orderBy]: sortOrder,
          },
    select:productSelect,
    take: limit,
    skip,
  });

  const wishListedProductIds: number[] = [];
  if (authUser) {
    const wishListedItems = await prisma.wishListItem.findMany({
      where: {
        customerId: authUser.customerId,
      },
    });

    wishListedItems.forEach((item) =>
      wishListedProductIds.push(item.productId),
    );
  }

  const data = products.map((product) => {
    // Calculate stock
    product.availableQuantity = product.variants.length ? product.variants.reduce(
      (p, c) => p + c.availableQuantity,
      0,
    ):product.availableQuantity;
    // Shot description
    product.description = product.description.slice(0, 300);
    product.variants = product.variants.filter(
      (variant) => variant.isHighlighted,
    );
    const upd = {
      ...product,
      isWishListed: wishListedProductIds.includes(product.id),
    };

    return upd;
  });
  const total = await prisma.product.count({
    where: { status: ProductStatus.ACTIVE },
  });
  const totalResult = await prisma.product.count({ where: whereConditions });

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
};
const deleteProductFromDB = async (id: string | number) => {
  id = Number(id);
  await prisma.product.delete({
    where: {
      id,
    },
  });
  return null;
};

const softDeleteProductFromDB = async (id: string | number) => {
  id = Number(id);
  const product = await prisma.product.findUnique({
    where: {
      id,
      status: {
        not: ProductStatus.DELETED,
      },
    },
  });

  if (!product) throw new AppError(httpStatus.NOT_FOUND, "Product not found");

  await prisma.product.update({
    where: {
      id,
    },
    data: {
      status: ProductStatus.DELETED,
    },
  });
  return null;
};

const updateProductStockIntoDB = async (
  payload: IUpdateProductStockPayload,
) => {
  const transaction = await prisma.$transaction(async (tx) => {
    // Update variant on variantId existence
    if (payload.variantId) {
      const variant = await tx.variant.findUnique({
        where: {
          id: payload.variantId,
          product: {
            status: ProductStatus.DELETED,
          },
        },
      });
      await tx.variant.update({
        where: {
          id: payload.variantId,
        },
        data: {
          availableQuantity: payload.availableQuantity,
        },
      });
      if (!variant)
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    } else {
      const product = await tx.product.findUnique({
        where: {
          id: payload.productId,
        },
      });
      if (!product)
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
      await tx.product.update({
        where: {
          id: payload.productId,
        },
        data: {
          availableQuantity: payload.availableQuantity,
        },
      });
    }
    const product = await tx.product.findUnique({
      where: {
        id: payload.productId,
      },
      select: {
        variants: true,
      },
    });

    // Update product real available quantity
    if (product && product.variants.length) {
      tx.product.update({
        where: {
          id: payload.productId,
        },
        data: {
          availableQuantity: product.variants.reduce(
            (p, c) => p + c.availableQuantity,
            0,
          ),
        },
      });
    }
  });
  return null;
};


const getTopBrandProductsFromDB = async (authUser:IAuthUser,id:string|number)=>{
  id = Number(id)

  const products = await prisma.product.findMany({
    where:{
      brand:{
        id
      }
    },
    select: productSelect,
    take:20
  });

  const wishListedProductIds: number[] = [];
  if (authUser) {
    const wishListedItems = await prisma.wishListItem.findMany({
      where: {
        customerId: authUser.customerId,
      },
    });

    wishListedItems.forEach((item) =>
      wishListedProductIds.push(item.productId),
    );
  }

  const data = products.map((product) => {
    // Calculate stock
    product.availableQuantity = product.variants.length ? product.variants.reduce(
      (p, c) => p + c.availableQuantity,
      0,
    ):product.availableQuantity;
    // Shot description
    product.description = product.description.slice(0, 300);
    product.variants = product.variants.filter(
      (variant) => variant.isHighlighted,
    );
    const upd = {
      ...product,
      isWishListed: wishListedProductIds.includes(product.id),
    };

    return upd;
  });
  
  return data
}


const getMyNotReviewedProductsFromDB = async (
  authUser: IAuthUser,
  paginationOptions: IPaginationOptions,
) => {
  const { skip, limit, page, orderBy, sortOrder } =
    calculatePagination(paginationOptions);

  const whereConditions: Prisma.OrderItemWhereInput = {
    order: {
      customer: {
        userId: authUser.id,
      },
    },
    isReviewed: false,
  };

  const data = await prisma.orderItem.findMany({
    where: whereConditions,
    include: {
      product: {
        select: {
          name: true,
          images: {
            take: 1,
          },
        },
      },
    },
    take: limit,
    skip,
    orderBy: {
      order: {
        [orderBy]: sortOrder,
      },
    },
  });

  const total = await prisma.orderItem.count({
    where: whereConditions,
  });

  return {
    data: data,
    meta: {
      total,
      skip,
      limit,
      page,
    },
  };
};


const getProductVariantsFromDB =  async (id:string|number)=>{
  id =  Number(id)
  const variants = await prisma.variant.findMany({
    where:{
      productId:id
    },
    include:{
      attributes:true
    }
  })
  return variants
}

const ProductServices = {
  createProductIntoDB,
  updateProductIntoDB,
  updateProductStockIntoDB,
  deleteProductFromDB,
  softDeleteProductFromDB,
  getFeaturedProductsFromDB,
  getNewArrivalProductsFromDB,
  getSearchProductsFromDB,
  getCategoryProductsFromDB,
  getBrandProductsFromDB,
  getProductBySlugForCustomerViewFromDB,
  getTopBrandProductsFromDB,
  getRelatedProductsByProductSlugFromDB,
  getRecentlyViewedProductsFromDB,
  getProductsForManageFromDB,
  getStockOutProductsFromDB,
  getMyNotReviewedProductsFromDB,
  getProductVariantsFromDB,

};

export default ProductServices;

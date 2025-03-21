import {
  Prisma,
  Product,
  ProductImage,
  ProductStatus,
  Variant,
} from "@prisma/client";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { IAuthUser } from "../Auth/auth.interface";
import {
  ICreateProductPayload,
  IProductFilterData,
  ISearchProductsFilterQuery,
  IUpdateProductPayload,
} from "./product.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../helpers/paginationHelper";
import {
  calculateDiscountPercentage,
  generateSlug,
} from "../../utils/function";
import { productsSelect } from "./product.constant";

const createProductIntoDB = async (payload: ICreateProductPayload) => {
  const {
    price,
    offerPrice,
    imageUrls,
    variants,
    categoryIds,
    specifications,
  } = payload;

  // Validate product pricing
  if (offerPrice && offerPrice >= price) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Offer price can not be getter than or equal price",
    );
  }

  // Validate variant pricing
  if (variants && variants.length) {
    variants.forEach((variant) => {
      if (variant.offerPrice && variant.offerPrice >= price) {
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
        in: categoryIds,
      },
    },
  });

  if (categories.length !== categoryIds.length) {
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
      data: payload.categoryIds.map((id) => ({
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
      data: imageUrls.map((ele) => ({
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

  const { categories, images,variants, specifications,brandId } =
    payload;

  const newAddedCategoryIds = categories
    .filter((_) => !_.id && !_.isDeleted)
    .map((_) => _.id);

  const newAddedImageUrls = images
    .filter((_) => !_.id && !_.isDeleted)
    .map((_) => _.url);
  const newAddedSpecifications = specifications.filter(
    (_) => !_.id && !_.isDeleted,
  );

  const newAddedVariants = variants?.filter((_) => !_.id && !_.isDeleted) || [];



  // Validations

  if(payload.brandId && !(await prisma.brand.findUnique({
    where:{id}
  }))){
    throw new AppError(httpStatus.NOT_FOUND,"Brand not found")
  }

  if (
    categories.filter((_) => _.isDeleted === true).length ===
      categories.length ||
    !categories.length
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Minimum 1 category is required",
    );
  }
  // Checking new added categories existence
  else if (
    newAddedCategoryIds.length &&
    (
      await prisma.category.findMany({
        where: {
          id: {
            in: newAddedCategoryIds,
          },
        },
        select: {
          id: true,
        },
      })
    ).length! == newAddedCategoryIds.length
  ) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found from new added",
    );
  }



  // Validations  images
  const imagesLength = images.filter((_) => _.isDeleted === true).length;
  if (imagesLength < 2 || imagesLength > 10) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Minimum 2 and maximum 10 image is required",
    );
  }

  // Validation spec
  const specsLength = specifications.filter((_) => _.isDeleted !== true).length;
  if (imagesLength === 0) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Minimum 1 specs is required",
    );
  }

  // Variants

  // Set pricing
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
      payload.offerPrice = highlightedVariant.offerPrice || payload.offerPrice;
      payload.availableQuantity = variants.reduce(
        (p, c) => p + c.availableQuantity,
        0,
      );
    }

    // Add available quantity 
   payload.availableQuantity =  variants
    .filter((_) => !_.isDeleted)
    .reduce((p,c)=>p+c.availableQuantity,0)
 
  }



  const result = await prisma.$transaction(async (txClient) => {

    //  Update primary data
    await txClient.product.update({
      where: {
        id,
      },
      data: {
       name:payload.name,
       description:payload.description,
       warrantyInfo:payload.warrantyInfo,
       brandId:payload.brandId,
       price:payload.price,
       offerPrice:payload.offerPrice,
       availableQuantity:payload.availableQuantity
      },
    });


    // Manage specs

    const deletedSpecificationIds =  specifications.filter(_=>_.isDeleted && _.id).map(_=>_.id!);
    // Delete deleted specs
    if(deletedSpecificationIds.length){
      await txClient.productSpecification.deleteMany({
        where:{
          id:{
            in:deletedSpecificationIds
          }
        }
      })
     
    }
    // Insert new added specs
    if(newAddedSpecifications.length) {
      await txClient.productSpecification.createMany({
        data:newAddedSpecifications.map(spec=>({
          name:spec.name,
          value:spec.value,
          productId:id
        }))
      })
    }
  
    // Manage images 

    const deletedImageIds =  images.filter(_=>_.isDeleted && _.id).map(_=>_.id!);
    // Delete deleted images
    if(deletedImageIds.length){
      await txClient.productImage.deleteMany({
        where:{
          id:{
            in:deletedImageIds
          }
        }
      })
    }

    // Insert new added images
    if(newAddedImageUrls.length){
      await txClient.productImage.createMany({
        data:newAddedImageUrls.map(url=>({
          productId:id,
          url
        }))
      })
    }
    
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
      ],
    });
  }

  const include: Prisma.ProductInclude = {
    category: {
      select: {
        name: true,
      },
    },
    // Default where
    variants: {
      where: {
        isHighlighted: true,
      },
      take: 1,
    },
    images: true,
  };

  // If minimum price and max price exist then filter by price range
  if (
    minPrice &&
    maxPrice &&
    !isNaN(parseInt(minPrice)) &&
    !isNaN(parseInt(maxPrice))
  ) {
    andConditions.push({
      OR: [
        {
          salePrice: {
            gt: parseInt(minPrice),
            lt: parseInt(maxPrice),
          },
        },
        {
          variants: {
            some: {
              salePrice: {
                gt: parseInt(minPrice),
                lt: parseInt(maxPrice),
              },
            },
          },
        },
      ],
    });
    include.variants = {
      where: {
        salePrice: {
          gt: parseInt(minPrice),
          lt: parseInt(maxPrice),
        },
      },
      take: 1,
    };
  } else {
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
        where: {
          salePrice: {
            gt: parseInt(minPrice),
          },
        },
        take: 1,
      };
    }
    // If only maximum price exist
    else if (maxPrice && parseInt(maxPrice)) {
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
        where: {
          salePrice: {
            lt: parseInt(maxPrice),
          },
        },
        take: 1,
      };
    }
  }

  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
    status: "Active",
  };

  let orBy = orderBy;

  if (orBy === "price") {
    orBy = "createdAt";
  }

  let data = await prisma.product.findMany({
    where: whereConditions,
    orderBy: {
      [orBy]: sortOrder,
    },
    include,
  });

  if (orderBy === "price") {
    data = data.sort((a: any, b: any) => {
      const aVariant = a.variants[0];
      const bVariant = b.variants[0];
      const aPrice = aVariant ? aVariant.salePrice : a.salePrice;
      const bPrice = bVariant ? bVariant.salePrice : b.salePrice;
      return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
    });
    data = data.slice(skip, skip + limit);
  }

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
};

const getSearchProductsFromDB = async (
  filterQuery: ISearchProductsFilterQuery,
  paginationOptions: IPaginationOptions,
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
  console.log(
    orderBy === "price"
      ? {
          offerPrice: sortOrder,
          price: sortOrder,
        }
      : {
          [orderBy]: sortOrder,
        },
  );
  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
    status: ProductStatus.ACTIVE,
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
    select: {
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
        },
      },
    },
  });

  const data = products.map((product) => {
    // Calculate stock
    product.availableQuantity = product.variants.reduce(
      (p, c) => p + c.availableQuantity,
      0,
    );
    // Shot description
    product.description = product.description.slice(0, 300);
    product.variants = product.variants.filter(
      (variant) => variant.isHighlighted,
    );
    return product;
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

  const include: Prisma.ProductInclude = {
    category: {
      select: {
        name: true,
      },
    },
    // Default where
    variants: {
      where: {
        isHighlighted: true,
      },
      take: 1,
    },
    images: true,
    _count: true,
  };

  // If minimum price and max price exist then filter by price range
  if (minPrice && maxPrice && parseInt(minPrice) && parseInt(maxPrice)) {
    andConditions.push({
      OR: [
        {
          salePrice: {
            gt: parseInt(minPrice),
            lt: parseInt(maxPrice),
          },
        },
        {
          variants: {
            some: {
              salePrice: {
                gt: parseInt(minPrice),
                lt: parseInt(maxPrice),
              },
            },
          },
        },
      ],
    });
    include.variants = {
      where: {
        salePrice: {
          gt: parseInt(minPrice),
          lt: parseInt(maxPrice),
        },
      },
      take: 1,
    };
  } else {
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
        where: {
          salePrice: {
            gt: parseInt(minPrice),
          },
        },
        take: 1,
      };
    }
    // If only maximum price exist
    else if (maxPrice && parseInt(maxPrice)) {
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
        where: {
          salePrice: {
            lt: parseInt(maxPrice),
          },
        },
        take: 1,
      };
    }
  }

  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
    status: {
      not: "Deleted",
    },
  };

  const data = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
    include,
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
};

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

const CheckSkuFromDB = async (sku: string) => {
  let status = false;
  const product = await prisma.product.findUnique({
    where: {
      sku,
    },
  });
  // If no product with this sku then check in variant
  if (!product) {
    const variant = await prisma.variant.findUnique({
      where: {
        sku,
      },
    });

    if (variant) status = true;
  } else status = true;
  return {
    status,
  };
};

const ProductServices = {
  createProductIntoDB,
  updateProductIntoDB,
  deleteProductFromDB,
  getFeaturedProductsFromDB,
  getProductsFromDB,
  getSearchProductsFromDB,
  getProductBySlugForCustomerViewFromDB,
  getRelatedProductsByProductSlugFromDB,
  getRecentlyViewedProductsFromDB,
  getMyProductsFromDB,
  getProductsForManageFromDB,
  getRecommendedProductsFromDB,
  CheckSkuFromDB,
};

export default ProductServices;

import { Category, Prisma, ProductStatus } from "@prisma/client";
import { IPaginationOptions } from "../../interfaces/pagination";
import prisma from "../../shared/prisma";
import {
  ICategoryFilterRequest,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";
import { calculatePagination } from "../../helpers/paginationHelper";
import {
  generateSlug,
  getCategoriesWithHierarchyStr,
} from "../../utils/function";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";

const createCategoryIntoDB = async (payload: ICreateCategoryPayload) => {
  // Check parent category existence
  if (payload.parentId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.parentId,
      },
    });
    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Parent category not found");
    }
  }

  let slug = generateSlug(payload.name);
  let counter = 1;
  while (
    await prisma.category.findUnique({ where: { slug }, select: { id: true } })
  ) {
    slug = generateSlug(`${payload.name} ${counter++}`);
  }
  const { children, parentId, ...others } = payload;
  const data: any = {
    ...others,
    slug,
  };

  if (parentId) {
    data.parentId = payload.parentId;
  }

  // Create parent category
  const result = await prisma.$transaction(async (tx) => {
    const createdParentCategory = await tx.category.create({
      data: data,
    });

    const children = payload.children;

    if (children && children.length) {
      const childCategoriesData = [];

      // Create child categories of this category
      for (let i = 0; i < children.length; i++) {
        const item = children[i];

        // Generate unique slug
        let slug = generateSlug(item.name);
        while (
          await prisma.category.findUnique({
            where: { slug },
            select: { id: true },
          })
        ) {
          slug = generateSlug(`${item.name} ${counter++}`);
        }

        const data = {
          ...item,
          parentId: createdParentCategory.id,
          slug,
        };
        childCategoriesData.push(data);
      }

      // Create child categories
      await tx.category.createMany({
        data: childCategoriesData,
      });
    }

    return await tx.category.findUnique({
      where: {
        id: createdParentCategory.id,
      },
      include: {
        children: true,
      },
    });
  });

  return result;
};

const updateCategoryIntoDB = async (
  id: string | number,
  payload: IUpdateCategoryPayload,
) => {
  id = Number(id);
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const data: any = {
    ...payload,
  };

  // If name has changed then generate new slug base on new name
  if (payload.name && category.name !== payload.name) {
    // Generate unique slug
    let counter = 1;
    let slug = generateSlug(payload.name);
    while (
      await prisma.category.findUnique({
        where: { slug },
        select: { id: true },
      })
    ) {
      slug = generateSlug(`${payload.name} ${counter++}`);
    }

    data.slug = slug;
  }

  const result = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

const deleteCategoryByIdFromDB = async (id: string | number) => {
  id = Number(id);
  // Check category existence
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  await prisma.category.delete({
    where: {
      id,
    },
  });
  return null;
};

const getCategoriesFromDB = async (
  filterRequest: ICategoryFilterRequest,
  options: IPaginationOptions,
) => {
  const { searchTerm, ...othersFilterData } = filterRequest;
  const { limit, skip, page } = calculatePagination(options);

  // If category parentId exist the typecast it number => string
  if (othersFilterData.parentId) {
    othersFilterData.parentId = Number(othersFilterData.parentId);
  }

  const andConditions: Prisma.CategoryWhereInput[] = [
  
  ];

  if (searchTerm) {
    const blogSearchableFields = ["name"];
    andConditions.push({
      OR: [
        ...blogSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
      ],
    });
  }

  if (othersFilterData && Object.keys(othersFilterData).length) {
    andConditions.push({
      AND: Object.keys(othersFilterData).map((key) => ({
        [key]: {
          equals: (othersFilterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.CategoryWhereInput = {
    AND: andConditions,
    isVisible: true,
    // parentId:null
  };
 let childInclude: any = {};
let current = childInclude;

for (let i = 0; i < 10; i++) {
  current.include = {
    _count:true,
    children:{}
  };
  current = current.include.children;
}
console.log(childInclude)

  const categories = await prisma.category.findMany({
    where: whereConditions,
    select: {
      id: true,
      name: true,
      imageUrl: true,
      slug: true,
      parentId: true,
      _count: true,
      children:childInclude
      ,
      
    },
   
    skip,
    take: limit,
  });

  const data = categories;
  const totalResult = await prisma.category.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit,
    totalResult,
  };

  for (const category of categories){
   
    if(category.children){

    }
  }

  return {
    meta,
    data,
  };
};

const getPopularCategoriesFromDB = async () => {
  return await prisma.$queryRaw`SELECT name,id FROM "categories" ORDER BY RANDOM() LIMIT 12`;
};

const getFeaturedCategoriesFromDB = async () => {
  return await prisma.category.findMany({
    where: {
      isFeatured: true,
      isVisible: true,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
};

const getSearchRelatedCategoriesFromDB = async (filterQuery: {
  searchTerm?: string;
}) => {
  const { searchTerm } = filterQuery;

  // Group categories
  const groupResult = await prisma.category.groupBy({
    where: {
      products: {
        some: {
          product: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      },
      isVisible: true,
    },
    by: "id",
  });

  //  Retrieve group categories
  const data = await prisma.category.findMany({
    where: {
      id: {
        in: groupResult.map((_) => _.id),
      },
    },
  });

  return data;
};
const getAllVisibleCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null, // Fetch only root categories
      isVisible: true,
    },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: {
                include: {
                  children: true, // Continue nesting as deep as needed
                },
              },
            },
          },
        },
      },
    },
  });

  const data = getCategoriesWithHierarchyStr(categories);

  return data;
};

const getSearchKeywordCategoriesFromDB = async (keyword: string) => {
  const categories = await prisma.category.findMany({
    where: {
      name: {
        contains: keyword,
        mode: "insensitive",
      },
    },
  });
  return categories;
};

const getChildCategoriesBySlugFromDB = async (slug: string) => {
  const categories = await prisma.category.findMany({
    where: {
      parent: {
        slug,
      },
    },
  });
  return categories;
};

const getChildCategoriesByIdFromDB = async (id: string) => {
  const categories = await prisma.category.findMany({
    where: {
      parent: {
        id: Number(id),
      },
    },
  });
  return categories;
};

const getBrandRelatedCategoriesFormDB = async (name: string) => {
  const groupCategories = await prisma.productCategory.groupBy({
    where: {
      product: {
        brand: {
          name,
        },
      },
    },
    by: "categoryId",
  });
  const data = prisma.category.findMany({
    where: {
      id: {
        in: groupCategories.map((_) => _.categoryId),
      },
    },
  });
  return data;
};

const CategoryServices = {
  createCategoryIntoDB,
  getCategoriesFromDB,
  getPopularCategoriesFromDB,
  getFeaturedCategoriesFromDB,
  getSearchRelatedCategoriesFromDB,
  getBrandRelatedCategoriesFormDB,
  getSearchKeywordCategoriesFromDB,
  updateCategoryIntoDB,
  deleteCategoryByIdFromDB,
  getAllVisibleCategoriesFromDB,
  getChildCategoriesBySlugFromDB,
  getChildCategoriesByIdFromDB,
};

export default CategoryServices;

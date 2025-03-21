import { Category, Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../interfaces/pagination";
import prisma from "../../shared/prisma";
import {
  ICategoryFilterRequest,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";
import { calculatePagination } from "../../helpers/paginationHelper";
import { generateSlug } from "../../utils/function";
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

const updateCategoryIntoDB = async (payload: IUpdateCategoryPayload) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.id,
    },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const data: any = {
    ...payload,
  };

  // If name has changed then generate new slug base on new name
  if (category.name !== payload.name) {
    let slug = generateSlug(payload.name);
    // Generate unique slug
    let counter = 1;
    do {
      const blog = await prisma.category.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
        },
      });
      if (!blog) {
        break;
      }
      counter++;
      slug = generateSlug(payload.name + " " + counter);
    } while (true);

    data.slug = slug;
  }

  const result = await prisma.category.update({
    where: {
      id: payload.id,
    },
    data,
  });

  return result;
};

const deleteCategoryByIdFromDB = async (id: string) => {
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

  const andConditions: Prisma.CategoryWhereInput[] = [];

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
  };

  const data = await prisma.category.findMany({
    where: whereConditions,
    select: {
      id: true,
      name: true,
      parentId: true,
      _count: true,
    },
    skip,
    take: limit,
  });

  const total = await prisma.category.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit,
    total,
  };

  return {
    meta,
    data,
  };
};

const getPopularCategoriesFromDB = async () => {
  return await prisma.$queryRaw`SELECT name,id FROM "categories" ORDER BY RANDOM() LIMIT 6`;
};

const getFeaturedCategoriesFromDB = async () => {
  return await prisma.category.findMany({
    where: {
      isFeatured: true,
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

const CategoryServices = {
  createCategoryIntoDB,
  getCategoriesFromDB,
  getPopularCategoriesFromDB,
  getFeaturedCategoriesFromDB,
  updateCategoryIntoDB,
  deleteCategoryByIdFromDB,
};

export default CategoryServices;

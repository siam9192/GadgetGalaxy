import { DiscountStatus, DiscountType, Prisma } from "@prisma/client";
import AppError from "../../Errors/AppError";
import { IPaginationOptions } from "../../interfaces/pagination";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { IAuthUser } from "../Auth/auth.interface";
import {
  IApplyDiscountPayload,
  ICreateDiscountPayload,
  IFilterDiscount,
  IUpdateDiscountPayload,
} from "./discount.interface";
import { calculatePagination } from "../../helpers/paginationHelper";

const createDiscountIntoDB = async (
  authUser: IAuthUser,
  payload: ICreateDiscountPayload,
) => {
  const discount = await prisma.discount.findUnique({
    where: {
      code: payload.code,
    },
  });

  if (discount)
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Discount coupon is already exist using this code.Try unique code",
    );

  const { customersId, categoriesId } = payload;

  //   Check customer existence
  if (customersId && customersId.length) {
    const customers = await prisma.customer.findMany({
      where: {
        id: {
          in: customersId,
        },
        user: {
          status: {
            not: "Deleted",
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (customers.length !== customersId.length) {
      const filterCustomerIds = customersId.filter(
        (id) => customers.map((ele) => ele.id).includes(id) === false,
      );
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Customer not found customers id ${filterCustomerIds.join(",")}`,
      );
    }
  }

  //   Check category existence
  if (categoriesId && categoriesId.length) {
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoriesId,
        },
      },
      select: {
        id: true,
      },
    });

    if (categories.length !== categoriesId.length) {
      const filterCategoryIds = categoriesId.filter(
        (id) => categories.map((ele) => ele.id).includes(id) === false,
      );
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Category not found categories id ${filterCategoryIds.join(",")}`,
      );
    }
  }

  const result = await prisma.$transaction(async (txClient) => {
    const createdDiscount = await txClient.discount.create({
      data: {
        code: payload.code,
        description: payload.description,
        discountType: payload.discountType,
        discountValue: payload.discountValue,
        minOrderValue:
          typeof payload.minOrderValue === "number"
            ? payload.minOrderValue
            : null,
        maxDiscount:
          typeof payload.maxDiscount === "number" ? payload.maxDiscount : null,
        usageLimit:
          typeof payload.usageLimit === "number" ? payload.usageLimit : null,
        validFrom: new Date(payload.validFrom),
        validUntil: new Date(payload.validUntil),
        status: payload.status || "Active",
      },
    });

    if (customersId && customersId.length) {
      for (let i = 0; i < customersId.length; i++) {
        await txClient.discountCustomerId.create({
          data: {
            customerId: customersId[i],
            discountId: createdDiscount.id,
          },
        });
      }
    }

    if (categoriesId && categoriesId.length) {
      for (let i = 0; i < categoriesId.length; i++) {
        await txClient.discountCategoryId.create({
          data: {
            categoryId: categoriesId[i],
            discountId: createdDiscount.id,
          },
        });
      }
    }

    // Create activity log
    await txClient.activityLog.create({
      data: {
        staffId: authUser.staffId!,
        action: `Created Discount.code:${createdDiscount.code} id:${createdDiscount.id}`,
      },
    });
    return createdDiscount;
  });

  return result;
};

const updateDiscountIntoDB = async (
  authUser: IAuthUser,
  id: string,
  payload: IUpdateDiscountPayload,
) => {
  const discount = await prisma.discount.findUnique({
    where: {
      id,
    },
  });

  if (!discount) throw new AppError(httpStatus.NOT_FOUND, "Discount not found");

  const { new: newI, removed, ...othersData } = payload;

  if (payload.code && payload.code !== discount.code) {
    const findDiscountByCode = await prisma.discount.findUnique({
      where: {
        code: payload.code,
      },
    });

    if (findDiscountByCode)
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Code is used in another discount.Try another code",
      );
  }

  if (payload.new) {
    const { customersId: newCustomersId, categoriesId: newCategoriesId } =
      payload.new;
    //   Check customer existence
    if (newCustomersId && newCustomersId.length) {
      const customers = await prisma.customer.findMany({
        where: {
          id: {
            in: newCustomersId,
          },
          user: {
            status: {
              not: "Deleted",
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (customers.length !== newCustomersId.length) {
        const filterCustomerIds = newCustomersId.filter(
          (id) => customers.map((ele) => ele.id).includes(id) === false,
        );
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Customer not found customers id ${filterCustomerIds.join(",")}`,
        );
      }
    }

    //   Check category existence
    if (newCategoriesId && newCategoriesId.length) {
      const categories = await prisma.category.findMany({
        where: {
          id: {
            in: newCategoriesId,
          },
        },
        select: {
          id: true,
        },
      });

      if (categories.length !== categories.length) {
        const filterCategoryIds = newCategoriesId.filter(
          (id) => categories.map((ele) => ele.id).includes(id) === false,
        );
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Category not found categories id ${filterCategoryIds.join(",")}`,
        );
      }
    }
  }

  const result = await prisma.$transaction(async (txClient) => {
    await txClient.discount.update({
      where: {
        id,
      },
      data: othersData,
    });

    if (payload.removed) {
      const { categoriesId: removedCategories, customersId: removedCustomers } =
        payload.removed;
      if (removedCustomers && removedCustomers.length) {
        for (let i = 0; i < removedCustomers.length; i++) {
          await txClient.discountCustomerId.delete({
            where: {
              discountId_customerId: {
                discountId: id,
                customerId: removedCustomers[i],
              },
            },
          });
        }
      }

      if (removedCategories && removedCategories.length) {
        for (let i = 0; i < removedCategories.length; i++) {
          await txClient.discountCategoryId.delete({
            where: {
              discountId_categoryId: {
                discountId: id,
                categoryId: removedCategories[i],
              },
            },
          });
        }
      }
    }
    if (payload.new) {
      const { customersId, categoriesId } = payload.new;
      if (customersId && customersId.length) {
        for (let i = 0; i < customersId.length; i++) {
          await txClient.discountCustomerId.create({
            data: {
              customerId: customersId[i],
              discountId: id,
            },
          });
        }
      }

      if (categoriesId && categoriesId.length) {
        for (let i = 0; i < categoriesId.length; i++) {
          await txClient.discountCategoryId.create({
            data: {
              categoryId: categoriesId[i],
              discountId: id,
            },
          });
        }
      }
    }

    await prisma.activityLog.create({
      data: {
        staffId: authUser.staffId!,
        action: `Updated discount id:${id}`,
      },
    });
    return await txClient.discount.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
        customers: true,
      },
    });
  });
  return result;
};

const getDiscountsFromDB = async (
  filter: IFilterDiscount,
  paginationOptions: IPaginationOptions,
) => {
  const { code, startDate, endDate, validFrom, validUntil, status } = filter;
  const andConditions: Prisma.DiscountWhereInput[] = [];

  if (code) {
    andConditions.push({
      code,
    });
  } else {
    if (startDate || endDate) {
      const validate = (date: string) => {
        return !isNaN(new Date(date).getTime());
      };

      if (startDate && validate(startDate) && endDate && validate(endDate)) {
        andConditions.push({
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        });
      } else if (startDate && validate(startDate)) {
        andConditions.push({
          createdAt: {
            gte: new Date(startDate),
          },
        });
      } else if (endDate && validate(endDate)) {
        andConditions.push({
          createdAt: {
            lte: new Date(endDate),
          },
        });
      }
    }

    if (validFrom || validUntil) {
      const validate = (date: string) => {
        return !isNaN(new Date(date).getTime());
      };

      if (
        validFrom &&
        validate(validFrom) &&
        validUntil &&
        validate(validUntil)
      ) {
        andConditions.push({
          validFrom: {
            gte: new Date(validFrom),
          },
          validUntil: {
            lte: new Date(validUntil),
          },
        });
      } else if (validFrom && validate(validFrom)) {
        andConditions.push({
          createdAt: {
            gte: new Date(validFrom),
          },
        });
      } else if (validUntil && validate(validUntil)) {
        andConditions.push({
          validUntil: {
            lte: new Date(validUntil),
          },
        });
      }
    }

    if (status && Object.values(DiscountStatus).includes(status)) {
      andConditions.push({
        status,
      });
    }
  }

  const whereConditions: Prisma.DiscountWhereInput = {
    AND: andConditions,
  };

  const { skip, limit, page, orderBy, sortOrder } =
    calculatePagination(paginationOptions);

  const data = await prisma.discount.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: sortOrder,
    },
  });

  const total = await prisma.discount.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit,
    total,
  };

  return {
    data,
    meta,
  };
};

const applyDiscount = async (
  authUser: IAuthUser,
  payload: IApplyDiscountPayload,
) => {
  const { code, cartItemsId } = payload;
  const discount = await prisma.discount.findUnique({
    where: {
      code: code,
    },
    include: {
      categories: true,
      customers: true,
    },
  });

  if (!discount) {
    throw new AppError(httpStatus.NOT_FOUND, "Discount coupon not found");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: {
      id: {
        in: cartItemsId,
      },
      customerId: authUser.customerId,
    },
    include: {
      product: true,
      variant: true,
    },
  });

  //  If any cart item not found then give error
  if (cartItems.length !== cartItemsId.length) {
    const notFoundCartItemsId = cartItems.filter(
      (item) => cartItemsId.includes(item.id) === false,
    );
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Cart item no found ids:${notFoundCartItemsId.join(",")}`,
    );
  }

  if (
    !discount.customers
      .map((ele) => ele.customerId)
      .includes(authUser.customerId!)
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Sorry this discount can not be applicable for you",
    );
  }

  const applicableCategoriesId = discount.categories.map(
    (ele) => ele.categoryId,
  );

  if (applicableCategoriesId.length) {
    const categoriesId = cartItems.map((item) => item.product.categoryId);

    const notAvailableCategoriesId: string[] = [];
    categoriesId.forEach((ele) => {
      // If product category not  found in applicable categories then push it notAvailableCategoriesId
      if (!applicableCategoriesId.includes(ele)) {
        notAvailableCategoriesId.push(ele);
      }
    });

    if (notAvailableCategoriesId.length) {
      const categories = await prisma.category.findMany({
        where: {
          id: {
            in: applicableCategoriesId,
          },
        },
      });
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `This discount coupon is  applicable for categories:${categories.map((category) => category.name).join(",")}`,
      );
    }
  }

  let totalAmount, discountAmount, grossAmount;

  totalAmount = cartItems.reduce((p, c) => {
    const { product, variant } = c;
    if (variant) {
      return p + variant.salePrice * c.quantity;
    } else {
      return p + product.salePrice! * c.quantity;
    }
  }, 0);

  if (discount.minOrderValue && discount.minOrderValue > totalAmount) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      `Sorry, you need to purchase a minimum of ${discount.minOrderValue} to apply this discount coupon.`,
    );
  }

  discountAmount =
    discount.discountType === DiscountType.Percentage
      ? (discount.discountValue / 100) * totalAmount
      : discount.discountValue;

  grossAmount = totalAmount - discountAmount;

  return {
    totalAmount,
    discountAmount,
    grossAmount,
  };
};

const validateDiscount = async (
  payload: IApplyDiscountPayload & { customerId: string },
) => {
  const { code, cartItemsId } = payload;
  const discount = await prisma.discount.findUnique({
    where: {
      code: code,
    },
    include: {
      categories: true,
      customers: true,
    },
  });

  if (!discount) {
    throw new AppError(httpStatus.NOT_FOUND, "Discount coupon not found");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: {
      id: {
        in: cartItemsId,
      },
      customerId: payload.customerId,
    },
    include: {
      product: true,
      variant: true,
    },
  });

  //  If any cart item not found then give error
  if (cartItems.length !== cartItemsId.length) {
    const notFoundCartItemsId = cartItems.filter(
      (item) => cartItemsId.includes(item.id) === false,
    );
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Cart item no found ids:${notFoundCartItemsId.join(",")}`,
    );
  }

  if (
    !discount.customers
      .map((ele) => ele.customerId)
      .includes(payload.customerId)
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Sorry this discount can not be applicable for you",
    );
  }

  const applicableCategoriesId = discount.categories.map(
    (ele) => ele.categoryId,
  );

  if (applicableCategoriesId.length) {
    const categoriesId = cartItems.map((item) => item.product.categoryId);

    const notAvailableCategoriesId: string[] = [];
    categoriesId.forEach((ele) => {
      // If product category not  found in applicable categories then push it notAvailableCategoriesId
      if (!applicableCategoriesId.includes(ele)) {
        notAvailableCategoriesId.push(ele);
      }
    });

    if (notAvailableCategoriesId.length) {
      const categories = await prisma.category.findMany({
        where: {
          id: {
            in: applicableCategoriesId,
          },
        },
      });
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `This discount coupon is  applicable for categories:${categories.map((category) => category.name).join(",")}`,
      );
    }
  }

  let totalAmount, discountAmount, grossAmount;

  totalAmount = cartItems.reduce((p, c) => {
    const { product, variant } = c;
    if (variant) {
      return p + variant.salePrice * c.quantity;
    } else {
      return p + product.salePrice! * c.quantity;
    }
  }, 0);

  if (discount.minOrderValue && discount.minOrderValue > totalAmount) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      `Sorry, you need to purchase a minimum of ${discount.minOrderValue} to apply this discount coupon.`,
    );
  }

  discountAmount =
    discount.discountType === DiscountType.Percentage
      ? (discount.discountValue / 100) * totalAmount
      : discount.discountValue;

  grossAmount = totalAmount - discountAmount;

  return {
    code: payload.code,
    discountId: discount.id,
    amount: {
      total: totalAmount,
      discount: discountAmount,
      gross: grossAmount,
    },
  };
};

const DiscountServices = {
  createDiscountIntoDB,
  updateDiscountIntoDB,
  getDiscountsFromDB,
  applyDiscount,
  validateDiscount,
};

export default DiscountServices;

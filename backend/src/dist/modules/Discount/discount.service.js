"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const createDiscountIntoDB = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const discount = yield prisma_1.default.discount.findUnique({
        where: {
            code: payload.code,
        },
    });
    if (discount)
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Discount coupon is already exist using this code.Try unique code");
    const { customersId, categoriesId } = payload;
    //   Check customer existence
    if (customersId && customersId.length) {
        const customers = yield prisma_1.default.customer.findMany({
            where: {
                id: {
                    in: customersId,
                },
                user: {
                    status: {
                        not: client_1.UserStatus.DELETED,
                    },
                },
            },
            select: {
                id: true,
            },
        });
        if (customers.length !== customersId.length) {
            const filterCustomerIds = customersId.filter((id) => customers.map((ele) => ele.id).includes(id) === false);
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Customer not found customers id ${filterCustomerIds.join(",")}`);
        }
    }
    //   Check category existence
    if (categoriesId && categoriesId.length) {
        const categories = yield prisma_1.default.category.findMany({
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
            const filterCategoryIds = categoriesId.filter((id) => categories.map((ele) => ele.id).includes(id) === false);
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Category not found categories id ${filterCategoryIds.join(",")}`);
        }
    }
    const result = yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdDiscount = yield txClient.discount.create({
            data: {
                title: payload.title,
                code: payload.code,
                description: payload.description,
                discountType: payload.discountType,
                discountValue: payload.discountValue,
                minOrderValue: payload.minOrderValue,
                maxDiscount: payload.maxDiscount,
                usageLimit: payload.usageLimit,
                validFrom: new Date(payload.validFrom),
                validUntil: new Date(payload.validUntil),
            },
        });
        if (customersId && customersId.length) {
            for (let i = 0; i < customersId.length; i++) {
                yield txClient.discountCustomerId.create({
                    data: {
                        customerId: customersId[i],
                        discountId: createdDiscount.id,
                    },
                });
            }
        }
        if (categoriesId && categoriesId.length) {
            for (let i = 0; i < categoriesId.length; i++) {
                yield txClient.discountCategoryId.create({
                    data: {
                        categoryId: categoriesId[i],
                        discountId: createdDiscount.id,
                    },
                });
            }
        }
        // Create activity log
        yield txClient.administratorActivityLog.create({
            data: {
                administratorId: authUser.administratorId,
                action: `Created New Discount ${createdDiscount.code} ID:${createdDiscount.id}`,
            },
        });
        const usersId = (yield prisma_1.default.customer.findMany({
            where: {
                id: {
                    in: payload.customersId,
                },
                user: {
                    status: client_1.UserStatus.ACTIVE,
                },
            },
        })).map((_) => _.userId);
        //  await txClient.notification.createMany({
        //   data:usersId.map((id)=>({
        //   title:payload.title
        //   }))
        //  })
        return createdDiscount;
    }));
    return result;
});
const updateDiscountIntoDB = (authUser, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const discount = yield prisma_1.default.discount.findUnique({
        where: {
            id,
        },
    });
    if (!discount)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Discount not found");
    const { new: newI, removed } = payload, othersData = __rest(payload, ["new", "removed"]);
    if (payload.code && payload.code !== discount.code) {
        const findDiscountByCode = yield prisma_1.default.discount.findUnique({
            where: {
                code: payload.code,
            },
        });
        if (findDiscountByCode)
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Code is used in another discount.Try another code");
    }
    if (payload.new) {
        const { customersId: newCustomersId, categoriesId: newCategoriesId } = payload.new;
        //   Check customer existence
        if (newCustomersId && newCustomersId.length) {
            const customers = yield prisma_1.default.customer.findMany({
                where: {
                    id: {
                        in: newCustomersId,
                    },
                    user: {
                        status: {
                            not: client_1.UserStatus.DELETED,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
            if (customers.length !== newCustomersId.length) {
                const filterCustomerIds = newCustomersId.filter((id) => customers.map((ele) => ele.id).includes(id) === false);
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Customer not found customers id ${filterCustomerIds.join(",")}`);
            }
        }
        //   Check category existence
        if (newCategoriesId && newCategoriesId.length) {
            const categories = yield prisma_1.default.category.findMany({
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
                const filterCategoryIds = newCategoriesId.filter((id) => categories.map((ele) => ele.id).includes(id) === false);
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Category not found categories id ${filterCategoryIds.join(",")}`);
            }
        }
    }
    const result = yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield txClient.discount.update({
            where: {
                id,
            },
            data: othersData,
        });
        if (payload.removed) {
            const { categoriesId: removedCategories, customersId: removedCustomers } = payload.removed;
            if (removedCustomers && removedCustomers.length) {
                for (let i = 0; i < removedCustomers.length; i++) {
                    yield txClient.discountCustomerId.delete({
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
                    yield txClient.discountCategoryId.delete({
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
                    yield txClient.discountCustomerId.create({
                        data: {
                            customerId: customersId[i],
                            discountId: id,
                        },
                    });
                }
            }
            if (categoriesId && categoriesId.length) {
                for (let i = 0; i < categoriesId.length; i++) {
                    yield txClient.discountCategoryId.create({
                        data: {
                            categoryId: categoriesId[i],
                            discountId: id,
                        },
                    });
                }
            }
        }
        yield prisma_1.default.administratorActivityLog.create({
            data: {
                administratorId: authUser.administratorId,
                action: `Updated discount id:${id}`,
            },
        });
        return yield txClient.discount.findUnique({
            where: {
                id,
            },
            include: {
                categories: true,
                customers: true,
            },
        });
    }));
    return result;
});
const getDiscountsFromDB = (filter, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, startDate, endDate, validFrom, validUntil, status } = filter;
    const andConditions = [];
    if (code) {
        andConditions.push({
            code,
        });
    }
    else {
        if (startDate || endDate) {
            const validate = (date) => {
                return !isNaN(new Date(date).getTime());
            };
            if (startDate && validate(startDate) && endDate && validate(endDate)) {
                andConditions.push({
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                });
            }
            else if (startDate && validate(startDate)) {
                andConditions.push({
                    createdAt: {
                        gte: new Date(startDate),
                    },
                });
            }
            else if (endDate && validate(endDate)) {
                andConditions.push({
                    createdAt: {
                        lte: new Date(endDate),
                    },
                });
            }
        }
        if (validFrom || validUntil) {
            const validate = (date) => {
                return !isNaN(new Date(date).getTime());
            };
            if (validFrom &&
                validate(validFrom) &&
                validUntil &&
                validate(validUntil)) {
                andConditions.push({
                    validFrom: {
                        gte: new Date(validFrom),
                    },
                    validUntil: {
                        lte: new Date(validUntil),
                    },
                });
            }
            else if (validFrom && validate(validFrom)) {
                andConditions.push({
                    createdAt: {
                        gte: new Date(validFrom),
                    },
                });
            }
            else if (validUntil && validate(validUntil)) {
                andConditions.push({
                    validUntil: {
                        lte: new Date(validUntil),
                    },
                });
            }
        }
    }
    const whereConditions = {
        AND: andConditions,
        status: client_1.DiscountStatus.ACTIVE,
    };
    const { skip, limit, page, orderBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const data = yield prisma_1.default.discount.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [orderBy]: sortOrder,
        },
    });
    const totalResult = yield prisma_1.default.discount.count({
        where: whereConditions,
    });
    const total = yield prisma_1.default.discount.count();
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
});
const getDiscountsForManageFromDB = (filter, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, startDate, endDate, validFrom, validUntil, status } = filter;
    const andConditions = [];
    if (code) {
        andConditions.push({
            code,
        });
    }
    else {
        if (startDate || endDate) {
            const validate = (date) => {
                return !isNaN(new Date(date).getTime());
            };
            if (startDate && validate(startDate) && endDate && validate(endDate)) {
                andConditions.push({
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                });
            }
            else if (startDate && validate(startDate)) {
                andConditions.push({
                    createdAt: {
                        gte: new Date(startDate),
                    },
                });
            }
            else if (endDate && validate(endDate)) {
                andConditions.push({
                    createdAt: {
                        lte: new Date(endDate),
                    },
                });
            }
        }
        if (validFrom || validUntil) {
            const validate = (date) => {
                return !isNaN(new Date(date).getTime());
            };
            if (validFrom &&
                validate(validFrom) &&
                validUntil &&
                validate(validUntil)) {
                andConditions.push({
                    validFrom: {
                        gte: new Date(validFrom),
                    },
                    validUntil: {
                        lte: new Date(validUntil),
                    },
                });
            }
            else if (validFrom && validate(validFrom)) {
                andConditions.push({
                    createdAt: {
                        gte: new Date(validFrom),
                    },
                });
            }
            else if (validUntil && validate(validUntil)) {
                andConditions.push({
                    validUntil: {
                        lte: new Date(validUntil),
                    },
                });
            }
        }
        if (status && Object.values(client_1.DiscountStatus).includes(status)) {
            andConditions.push({
                status,
            });
        }
    }
    const whereConditions = {
        AND: andConditions,
    };
    const { skip, limit, page, orderBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const data = yield prisma_1.default.discount.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [orderBy]: sortOrder,
        },
    });
    const totalResult = yield prisma_1.default.discount.count({
        where: whereConditions,
    });
    const total = yield prisma_1.default.discount.count();
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
});
const changeDiscountStatusIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.discount.update({
        where: {
            id: payload.id,
        },
        data: {
            status: payload.status,
        },
    });
    return;
});
const applyDiscount = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, cartItemsId } = payload;
    const discount = yield prisma_1.default.discount.findUnique({
        where: {
            code: code,
        },
        include: {
            categories: true,
            customers: true,
        },
    });
    if (!discount) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Discount coupon not found");
    }
    const cartItems = yield prisma_1.default.cartItem.findMany({
        where: {
            id: {
                in: cartItemsId,
            },
            customerId: authUser.customerId,
        },
        include: {
            product: {
                include: { categories: true },
            },
            variant: true,
        },
    });
    //  If any cart item not found then give error
    if (cartItems.length !== cartItemsId.length) {
        const notFoundCartItemsId = cartItems.filter((item) => cartItemsId.includes(item.id) === false);
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Cart item no found ids:${notFoundCartItemsId.join(",")}`);
    }
    if (discount.customers &&
        discount.customers.length &&
        !discount.customers
            .map((ele) => ele.customerId)
            .includes(authUser.customerId)) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Sorry this discount can not be applicable for you");
    }
    const applicableCategoriesId = discount.categories.map((ele) => ele.categoryId);
    if (applicableCategoriesId.length) {
        const categoriesId = [];
        cartItems.forEach((item) => {
            item.product.categories.forEach((_) => {
                categoriesId.push(_.categoryId);
            });
        });
        const notAvailableCategoriesId = [];
        categoriesId.forEach((ele) => {
            // If product category not  found in applicable categories then push it notAvailableCategoriesId
            if (!applicableCategoriesId.includes(ele)) {
                notAvailableCategoriesId.push(ele);
            }
        });
        if (notAvailableCategoriesId.length) {
            const categories = yield prisma_1.default.category.findMany({
                where: {
                    id: {
                        in: applicableCategoriesId,
                    },
                },
            });
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `This discount coupon is  applicable for categories:${categories.map((category) => category.name).join(",")}`);
        }
    }
    let totalAmount, discountAmount, grossAmount;
    totalAmount = cartItems.reduce((p, c) => {
        const { product, variant } = c;
        if (variant) {
            return p + (variant.offerPrice || variant.price) * c.quantity;
        }
        else {
            return p + (product.offerPrice || product.price) * c.quantity;
        }
    }, 0);
    if (discount.minOrderValue && discount.minOrderValue > totalAmount) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Sorry, you need to purchase a minimum of ${discount.minOrderValue} to apply this discount coupon.`);
    }
    discountAmount =
        discount.discountType === client_1.DiscountType.PERCENTAGE
            ? (discount.discountValue / 100) * totalAmount
            : discount.discountValue;
    grossAmount = totalAmount - discountAmount;
    return {
        totalAmount,
        discountAmount,
        grossAmount,
    };
});
const validateDiscount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // const { code, cartItemsId } = payload;
    // const discount = await prisma.discount.findUnique({
    //   where: {
    //     code: code,
    //   },
    //   include: {
    //     categories: true,
    //     customers: true,
    //   },
    // });
    // if (!discount) {
    //   throw new AppError(httpStatus.NOT_FOUND, "Discount coupon not found");
    // }
    // const cartItems = await prisma.cartItem.findMany({
    //   where: {
    //     id: {
    //       in: cartItemsId,
    //     },
    //     customerId: payload.customerId,
    //   },
    //   include: {
    //     product: true,
    //     variant: true,
    //   },
    // });
    // //  If any cart item not found then give error
    // if (cartItems.length !== cartItemsId.length) {
    //   const notFoundCartItemsId = cartItems.filter(
    //     (item) => cartItemsId.includes(item.id) === false,
    //   );
    //   throw new AppError(
    //     httpStatus.NOT_FOUND,
    //     `Cart item no found ids:${notFoundCartItemsId.join(",")}`,
    //   );
    // }
    // if (
    //   !discount.customers
    //     .map((ele) => ele.customerId)
    //     .includes(payload.customerId)
    // ) {
    //   throw new AppError(
    //     httpStatus.NOT_ACCEPTABLE,
    //     "Sorry this discount can not be applicable for you",
    //   );
    // }
    // const applicableCategoriesId = discount.categories.map(
    //   (ele) => ele.categoryId,
    // );
    // if (applicableCategoriesId.length) {
    //   const categoriesId = cartItems.map((item) => item.product.categoryId);
    //   const notAvailableCategoriesId: string[] = [];
    //   categoriesId.forEach((ele) => {
    //     // If product category not  found in applicable categories then push it notAvailableCategoriesId
    //     if (!applicableCategoriesId.includes(ele)) {
    //       notAvailableCategoriesId.push(ele);
    //     }
    //   });
    //   if (notAvailableCategoriesId.length) {
    //     const categories = await prisma.category.findMany({
    //       where: {
    //         id: {
    //           in: applicableCategoriesId,
    //         },
    //       },
    //     });
    //     throw new AppError(
    //       httpStatus.NOT_ACCEPTABLE,
    //       `This discount coupon is  applicable for categories:${categories.map((category) => category.name).join(",")}`,
    //     );
    //   }
    // }
    // let totalAmount, discountAmount, grossAmount;
    // totalAmount = cartItems.reduce((p, c) => {
    //   const { product, variant } = c;
    //   if (variant) {
    //     return p + variant.salePrice * c.quantity;
    //   } else {
    //     return p + product.salePrice! * c.quantity;
    //   }
    // }, 0);
    // if (discount.minOrderValue && discount.minOrderValue > totalAmount) {
    //   throw new AppError(
    //     httpStatus.NOT_ACCEPTABLE,
    //     `Sorry, you need to purchase a minimum of ${discount.minOrderValue} to apply this discount coupon.`,
    //   );
    // }
    // discountAmount =
    //   discount.discountType === DiscountType.PERCENTAGE
    //     ? (discount.discountValue / 100) * totalAmount
    //     : discount.discountValue;
    // grossAmount = totalAmount - discountAmount;
    // return {
    //   code: payload.code,
    //   discountId: discount.id,
    //   amount: {
    //     total: totalAmount,
    //     discount: discountAmount,
    //     gross: grossAmount,
    //   },
    // };
});
const DiscountServices = {
    createDiscountIntoDB,
    updateDiscountIntoDB,
    changeDiscountStatusIntoDB,
    getDiscountsForManageFromDB,
    getDiscountsFromDB,
    applyDiscount,
    validateDiscount,
};
exports.default = DiscountServices;

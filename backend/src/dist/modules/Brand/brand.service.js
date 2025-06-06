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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const createBrandIntoDB = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield prisma_1.default.brand.findUnique({
        where: {
            name: payload.name,
        },
    });
    if (brand) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Brand already exist in this name");
    }
    const result = yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdBrand = yield txClient.brand.create({
            data: payload,
        });
        yield txClient.administratorActivityLog.create({
            data: {
                administratorId: authUser.administratorId,
                action: `✨ Created New Brand "${createdBrand.name}". (ID: ${createdBrand.id})`,
            },
        });
        return createdBrand;
    }));
    return result;
});
const getBrandsFromDB = (filter, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const andConditions = [];
    const { searchTerm, origin } = filter;
    if (searchTerm) {
        andConditions.push({
            name: {
                contains: searchTerm,
                mode: "insensitive",
            },
        });
    }
    if (origin) {
        andConditions.push({
            origin,
        });
    }
    const { skip, limit, page, orderBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const whereConditions = {
        AND: andConditions,
    };
    const data = yield prisma_1.default.brand.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [orderBy]: sortOrder,
        },
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });
    const totalResult = yield prisma_1.default.brand.count({
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
});
const getBrandsForManageFromDB = (filter, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const andConditions = [];
    const { searchTerm, origin } = filter;
    // If the searchTerm is change to be id  than search brand base on id only  other wise apply
    if (searchTerm && !Number.isNaN(searchTerm)) {
        andConditions.push({
            id: Number(searchTerm),
        });
    }
    else {
        if (searchTerm) {
            andConditions.push({
                name: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            });
        }
        if (origin) {
            andConditions.push({
                origin,
            });
        }
    }
    const { skip, limit, page, orderBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const whereConditions = {
        AND: andConditions,
    };
    const data = yield prisma_1.default.brand.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [orderBy]: sortOrder,
        },
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });
    const totalResult = yield prisma_1.default.brand.count({
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
});
const getPopularBrandsFromDB = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const data = yield prisma_1.default.brand.findMany({
        where: {
            isPopular: true,
        },
        skip,
        take: limit,
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });
    const totalResult = yield prisma_1.default.brand.count({
        where: {
            isPopular: true,
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
});
const getFeaturedBrandsFromDB = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const data = yield prisma_1.default.brand.findMany({
        where: {
            isFeatured: true,
        },
        skip,
        take: limit,
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });
    const totalResult = yield prisma_1.default.brand.count({
        where: {
            isPopular: true,
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
});
const getTopBrandsFromDB = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const data = yield prisma_1.default.brand.findMany({
        where: {
            isFeatured: true,
        },
        skip,
        take: limit,
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });
    const totalResult = yield prisma_1.default.brand.count({
        where: {
            isTop: true,
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
});
const updateBrandIntoDB = (authUser, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const brand = yield prisma_1.default.brand.findUnique({
        where: {
            id,
        },
    });
    if (!brand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Brand not found");
    }
    //   Check brand name if it  changed
    if (payload.name && payload.name !== brand.name) {
        const brand = yield prisma_1.default.brand.findUnique({
            where: {
                name: payload.name,
            },
        });
        if (brand) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Brand is exist in this name");
        }
    }
    const result = yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedBrand = yield txClient.brand.update({
            where: {
                id,
            },
            data: payload,
        });
        // await txClient.activityLog.create({
        //   data: {
        //     staffId: authUser.staffId!,
        //     action: `Updated brand  id:${updatedBrand.id}`,
        //   },
        // });
        return updatedBrand;
    }));
    return result;
});
const getSearchRelatedBrandsFromDB = (filterQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filterQuery;
    // Group categories
    const groupResult = yield prisma_1.default.brand.groupBy({
        where: {
            products: {
                some: {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            },
        },
        by: "id",
    });
    //  Retrieve group categories
    const data = yield prisma_1.default.brand.findMany({
        where: {
            id: {
                in: groupResult.map((_) => _.id),
            },
        },
    });
    return data;
});
const getCategoryRelatedBrandsFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield prisma_1.default.brand.findMany({
        where: {
            products: {
                some: {
                    categories: {
                        some: {
                            category: {
                                slug,
                            },
                        },
                    },
                },
            },
        },
    });
    return brands;
});
const getSearchKeywordBrandsFromDB = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield prisma_1.default.brand.findMany({
        where: {
            name: {
                contains: keyword,
                mode: "insensitive",
            },
        },
    });
    return brands;
});
const BrandServices = {
    createBrandIntoDB,
    getBrandsFromDB,
    getBrandsForManageFromDB,
    getPopularBrandsFromDB,
    getFeaturedBrandsFromDB,
    getTopBrandsFromDB,
    getSearchRelatedBrandsFromDB,
    getCategoryRelatedBrandsFromDB,
    getSearchKeywordBrandsFromDB,
    updateBrandIntoDB,
};
exports.default = BrandServices;

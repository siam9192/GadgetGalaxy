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
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const function_1 = require("../../utils/function");
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const createCategoryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check parent category existence
    if (payload.parentId) {
        const category = yield prisma_1.default.category.findUnique({
            where: {
                id: payload.parentId,
            },
        });
        if (!category) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Parent category not found");
        }
    }
    let slug = (0, function_1.generateSlug)(payload.name);
    let counter = 1;
    while (yield prisma_1.default.category.findUnique({ where: { slug }, select: { id: true } })) {
        slug = (0, function_1.generateSlug)(`${payload.name} ${counter++}`);
    }
    const { children, parentId } = payload, others = __rest(payload, ["children", "parentId"]);
    const data = Object.assign(Object.assign({}, others), { slug });
    if (parentId) {
        data.parentId = payload.parentId;
    }
    // Create parent category
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createdParentCategory = yield tx.category.create({
            data: data,
        });
        const children = payload.children;
        if (children && children.length) {
            const childCategoriesData = [];
            // Create child categories of this category
            for (let i = 0; i < children.length; i++) {
                const item = children[i];
                // Generate unique slug
                let slug = (0, function_1.generateSlug)(item.name);
                while (yield prisma_1.default.category.findUnique({
                    where: { slug },
                    select: { id: true },
                })) {
                    slug = (0, function_1.generateSlug)(`${item.name} ${counter++}`);
                }
                const data = Object.assign(Object.assign({}, item), { parentId: createdParentCategory.id, slug });
                childCategoriesData.push(data);
            }
            // Create child categories
            yield tx.category.createMany({
                data: childCategoriesData,
            });
        }
        return yield tx.category.findUnique({
            where: {
                id: createdParentCategory.id,
            },
            include: {
                children: true,
            },
        });
    }));
    return result;
});
const updateCategoryIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const category = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (!category) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    const data = Object.assign({}, payload);
    // If name has changed then generate new slug base on new name
    if (payload.name && category.name !== payload.name) {
        // Generate unique slug
        let counter = 1;
        let slug = (0, function_1.generateSlug)(payload.name);
        while (yield prisma_1.default.category.findUnique({
            where: { slug },
            select: { id: true },
        })) {
            slug = (0, function_1.generateSlug)(`${payload.name} ${counter++}`);
        }
        data.slug = slug;
    }
    const result = yield prisma_1.default.category.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteCategoryByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    // Check category existence
    const category = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (!category) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    yield prisma_1.default.category.delete({
        where: {
            id,
        },
    });
    return null;
});
const getCategoriesFromDB = (filterRequest, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filterRequest, othersFilterData = __rest(filterRequest, ["searchTerm"]);
    const { limit, skip, page } = (0, paginationHelper_1.calculatePagination)(options);
    // If category parentId exist the typecast it number => string
    if (othersFilterData.parentId) {
        othersFilterData.parentId = Number(othersFilterData.parentId);
    }
    const andConditions = [];
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
                    equals: othersFilterData[key],
                },
            })),
        });
    }
    const whereConditions = {
        AND: andConditions,
        isVisible: true,
        // parentId:null
    };
    const categories = yield prisma_1.default.category.findMany({
        where: whereConditions,
        select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
            _count: true,
        },
        skip,
        take: limit,
    });
    const data = categories;
    const totalResult = yield prisma_1.default.category.count({
        where: whereConditions,
    });
    const meta = {
        page,
        limit,
        totalResult,
    };
    return {
        meta,
        data,
    };
});
const getPopularCategoriesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$queryRaw `SELECT name,id FROM "categories" ORDER BY RANDOM() LIMIT 12`;
});
const getFeaturedCategoriesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.category.findMany({
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
});
const getSearchRelatedCategoriesFromDB = (filterQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filterQuery;
    // Group categories
    const groupResult = yield prisma_1.default.category.groupBy({
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
    const data = yield prisma_1.default.category.findMany({
        where: {
            id: {
                in: groupResult.map((_) => _.id),
            },
        },
    });
    return data;
});
const getAllVisibleCategoriesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
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
    const data = (0, function_1.getCategoriesWithHierarchyStr)(categories);
    return data;
});
const getSearchKeywordCategoriesFromDB = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
        where: {
            name: {
                contains: keyword,
                mode: "insensitive",
            },
        },
    });
    return categories;
});
const getChildCategoriesBySlugFromDB = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
        where: {
            parent: {
                slug,
            },
        },
    });
    return categories;
});
const getChildCategoriesByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
        where: {
            parent: {
                id: Number(id),
            },
        },
    });
    return categories;
});
const getBrandRelatedCategoriesFormDB = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const groupCategories = yield prisma_1.default.productCategory.groupBy({
        where: {
            product: {
                brand: {
                    name,
                },
            },
        },
        by: "categoryId",
    });
    const data = prisma_1.default.category.findMany({
        where: {
            id: {
                in: groupCategories.map((_) => _.categoryId),
            },
        },
    });
    return data;
});
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
exports.default = CategoryServices;

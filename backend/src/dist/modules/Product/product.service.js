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
const function_1 = require("../../utils/function");
const constant_1 = require("../../utils/constant");
const createProductIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { imagesUrl, variants, categoriesId, specifications } = payload;
    // Validate product pricing
    if (payload.offerPrice && payload.offerPrice >= payload.price) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Offer price can not be getter than or equal price");
    }
    // Validate variant pricing
    if (variants && variants.length) {
        variants.forEach((variant) => {
            if (variant.offerPrice && (variant.offerPrice >= variant.price)) {
                throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Variant Offer price can not be getter than or equal price");
            }
        });
    }
    const categories = yield prisma_1.default.category.findMany({
        where: {
            id: {
                in: categoriesId,
            },
        },
    });
    if (categories.length !== categoriesId.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Category not found`);
    }
    let slug = (0, function_1.generateSlug)(payload.name);
    let counter = 1;
    while (yield prisma_1.default.product.findUnique({ where: { slug }, select: { id: true } })) {
        slug = (0, function_1.generateSlug)(`${payload.name} ${counter++}`);
    }
    // If variant exist the highlighted variant price will be set as product default price  set with available quantity
    if (variants && variants.length) {
        const highlightedVariant = variants.find((_) => _.isHighlighted) || variants[0];
        payload.price = highlightedVariant.price;
        payload.offerPrice = highlightedVariant.offerPrice || payload.offerPrice;
        payload.availableQuantity = variants.reduce((p, c) => p + c.availableQuantity, 0);
    }
    const productData = {
        name: payload.name,
        slug,
        brandId: payload.brandId,
        sku: payload.sku,
        description: payload.description,
        warrantyInfo: payload.warrantyInfo,
        price: payload.price,
        offerPrice: payload.offerPrice,
        discountPercentage: (0, function_1.calculateDiscountPercentage)(payload.price, payload.offerPrice),
        availableQuantity: payload.availableQuantity,
    };
    // Use transaction
    const result = yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createdProductData = yield txClient.product.create({
            data: productData,
        });
        // Create product category
        yield txClient.productCategory.createMany({
            data: payload.categoriesId.map((id) => ({
                productId: createdProductData.id,
                categoryId: id,
            })),
        });
        // if product variant exist then insert it into db
        if (variants && variants.length) {
            for (let i = 0; i < variants.length; i++) {
                const _a = variants[i], { attributes } = _a, variant = __rest(_a, ["attributes"]);
                // Insert variant fist after insert variant attributes
                const createdVariant = yield txClient.variant.create({
                    data: Object.assign(Object.assign({ productId: createdProductData.id }, variant), { discountPercentage: (0, function_1.calculateDiscountPercentage)(variant.price, variant.offerPrice), isHighlighted: variants.find((_) => _.isHighlighted)
                            ? true
                            : i === 0
                                ? true
                                : false }),
                });
                yield txClient.variantAttribute.createMany({
                    data: attributes.map((_) => (Object.assign({ variantId: createdVariant.id }, _))),
                });
            }
        }
        // if product specification exist then insert it into db
        if (specifications && specifications.length) {
            yield txClient.productSpecification.createMany({
                data: specifications.map((item) => ({
                    productId: createdProductData.id,
                    name: item.name,
                    value: item.name,
                })),
            });
        }
        // Insert image urls
        yield txClient.productImage.createMany({
            data: imagesUrl.map((ele) => ({
                productId: createdProductData.id,
                url: ele,
            })),
        });
        return yield txClient.product.findUnique({
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
    }));
    return result;
});
const updateProductIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id,
        },
    });
    // Checking product existence
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    const { categoriesId, imagesUrl, variants, specifications, brandId } = payload;
    // Validations
    if (!payload.variants) {
        if (payload.price && !payload.offerPrice) {
            if (product.offerPrice && payload.price <= product.offerPrice) {
                throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Offer price can not be getter than or equal main price");
            }
        }
    }
    if (payload.brandId &&
        !(yield prisma_1.default.brand.findUnique({
            where: { id },
        }))) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Brand not found");
    }
    if (imagesUrl && (imagesUrl.length < 2 || imagesUrl.length > 10)) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Minimum 2 and maximum 10 image is required");
    }
    if (specifications && !specifications.length) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Minimum 1 specs is required");
    }
    // Variants
    // Set pricing
    if (variants) {
        if (variants === null || variants === void 0 ? void 0 : variants.filter((_) => !_.isDeleted).length) {
            // Check price
            variants
                .filter((_) => !_.isDeleted)
                .forEach((variant) => {
                if (variant.offerPrice) {
                    if (variant.offerPrice >= variant.price)
                        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Variant offer price can not be getter than or equal of main price");
                }
            });
            const highlightedVariant = variants
                .filter((_) => !_.isDeleted)
                .find((_) => _.isHighlighted);
            if (highlightedVariant) {
                payload.price = highlightedVariant.price;
                payload.offerPrice =
                    highlightedVariant.offerPrice || payload.offerPrice;
                payload.availableQuantity = variants.reduce((p, c) => p + c.availableQuantity, 0);
            }
            // Add available quantity
            payload.availableQuantity = variants
                .filter((_) => !_.isDeleted)
                .reduce((p, c) => p + c.availableQuantity, 0);
        }
    }
    const result = yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
        //  Update primary data
        yield txClient.product.update({
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
            yield txClient.productImage.deleteMany({
                where: {
                    productId: id,
                },
            });
            // Second insert images url that payload contains
            yield txClient.productImage.createMany({
                data: imagesUrl.map((url) => ({
                    url,
                    productId: id,
                })),
            });
        }
        // Manage Categories
        // First delete product categories
        yield txClient.productCategory.deleteMany({
            where: {
                productId: id,
            },
        });
        if (categoriesId && categoriesId.length) {
            // Second insert categories  id that payload contains
            yield txClient.productCategory.createMany({
                data: categoriesId.map((id) => ({
                    categoryId: id,
                    productId: id,
                })),
            });
        }
        if (specifications && specifications.length) {
            // Manage Specifications
            // First delete all  specifications
            yield txClient.productSpecification.deleteMany({
                where: {
                    productId: id,
                },
            });
            // Second insert all  specifications
            yield txClient.productSpecification.createMany({
                data: specifications.map((spec) => (Object.assign({ productId: id }, spec))),
            });
        }
        if (variants && variants.length) {
            const deletedVariantsId = variants
                .filter((_) => _.isDeleted === true && _.id)
                .map((_) => _.id);
            // Delete variants if exist
            if (deletedVariantsId.length) {
                yield txClient.variant.deleteMany({
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
                    const { attributes, isDeleted, id: varId } = variant, others = __rest(variant, ["attributes", "isDeleted", "id"]);
                    // Insert variant
                    const createdVariant = yield txClient.variant.create({
                        data: Object.assign(Object.assign({ productId: id }, others), { discountPercentage: (0, function_1.calculateDiscountPercentage)(others.price, others.offerPrice) }),
                    });
                    //  Insert variant attributes
                    yield txClient.variantAttribute.createMany({
                        data: attributes.map((att) => (Object.assign({ variantId: createdVariant.id }, att))),
                    });
                }
            }
            const updatedVariants = variants.filter((_) => _.id && !_.isDeleted);
            if (updatedVariants.length) {
                for (const variant of updatedVariants) {
                    const { id, isDeleted, attributes } = variant, other = __rest(variant, ["id", "isDeleted", "attributes"]);
                    yield txClient.variant.update({
                        where: {
                            id: id,
                        },
                        data: other,
                    });
                    yield txClient.variantAttribute.deleteMany({
                        where: {
                            variantId: id,
                        },
                    });
                    yield txClient.variantAttribute.createMany({
                        data: attributes.map((att) => {
                            return Object.assign({ variantId: id }, att);
                        }),
                    });
                }
            }
            const updatedProduct = yield txClient.product.findUnique({
                where: {
                    id,
                },
                select: {
                    variants: true,
                },
            });
            return yield txClient.product.findUnique({
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
    }));
    return result;
});
const getRecentlyViewedProductsFromDB = (authUser, ids) => __awaiter(void 0, void 0, void 0, function* () {
    const productsId = ids
        .split(",")
        .filter((_) => !Number.isNaN(_))
        .map((_) => parseInt(_));
    let wishListedProductIds = [];
    if (authUser) {
        const wishListedItems = yield prisma_1.default.wishListItem.findMany({
            where: {
                customerId: authUser.customerId,
            },
        });
        wishListedItems.forEach((item) => wishListedProductIds.push(item.productId));
    }
    const products = yield prisma_1.default.product.findMany({
        where: {
            id: {
                in: productsId,
            },
            status: client_1.ProductStatus.ACTIVE,
        },
        select: constant_1.productSelect,
    });
    const data = products.map((product) => {
        // Calculate stock
        product.availableQuantity = product.variants.length
            ? product.variants.reduce((p, c) => p + c.availableQuantity, 0)
            : product.availableQuantity;
        // Shot description
        product.description = product.description.slice(0, 300);
        product.variants = product.variants.filter((variant) => variant.isHighlighted);
        const upd = Object.assign(Object.assign({}, product), { isWishListed: wishListedProductIds.includes(product.id) });
        return upd;
    });
    return data;
});
const getSearchProductsFromDB = (filterQuery, paginationOptions, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, orderBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [
        {
            status: client_1.ProductStatus.ACTIVE,
        },
    ];
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
    const validateNumber = (number) => {
        return !isNaN(parseInt(number));
    };
    // If minimum price and max price exist then filter by price range
    if (minPrice &&
        maxPrice &&
        validateNumber(minPrice) &&
        validateNumber(maxPrice)) {
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
    }
    else {
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
    const whereConditions = {
        AND: andConditions,
        status: client_1.ProductStatus.ACTIVE,
        availableQuantity: {
            gt: 0,
        },
    };
    const products = yield prisma_1.default.product.findMany({
        where: whereConditions,
        orderBy: orderBy === "price"
            ? [
                { offerPrice: sortOrder }, // NULLs first by default
                { price: sortOrder },
            ]
            : {
                [orderBy]: sortOrder,
            },
        select: constant_1.productSelect,
        take: limit,
        skip,
    });
    const wishListedProductIds = [];
    if (authUser) {
        const wishListedItems = yield prisma_1.default.wishListItem.findMany({
            where: {
                customerId: authUser.customerId,
            },
        });
        wishListedItems.forEach((item) => wishListedProductIds.push(item.productId));
    }
    const data = products.map((product) => {
        // Calculate stock
        product.availableQuantity = product.variants.length
            ? product.variants.reduce((p, c) => p + c.availableQuantity, 0)
            : product.availableQuantity;
        // Shot description
        product.description = product.description.slice(0, 300);
        product.variants = product.variants.filter((variant) => variant.isHighlighted);
        const upd = Object.assign(Object.assign({}, product), { isWishListed: wishListedProductIds.includes(product.id) });
        return upd;
    });
    const total = yield prisma_1.default.product.count({
        where: { status: client_1.ProductStatus.ACTIVE },
    });
    const totalResult = yield prisma_1.default.product.count({ where: whereConditions });
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
const getProductsForManageFromDB = (filterData, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, category, brand, minPrice, maxPrice } = filterData;
    const { limit, skip, page, sortOrder, orderBy } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
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
    }
    const validateNumber = (number) => {
        return !isNaN(parseInt(number));
    };
    // If minimum price and max price exist then filter by price range
    if (minPrice &&
        maxPrice &&
        validateNumber(minPrice) &&
        validateNumber(maxPrice)) {
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
    }
    else {
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
    const whereConditions = {
        AND: andConditions,
        status: {
            not: client_1.ProductStatus.DELETED,
        },
        availableQuantity: {
            gt: 0,
        },
    };
    const data = yield prisma_1.default.product.findMany({
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
                                status: client_1.OrderStatus.DELIVERED,
                            },
                        },
                    },
                    variants: true,
                },
            },
        },
    });
    const totalResult = yield prisma_1.default.product.count({
        where: whereConditions,
    });
    const total = yield prisma_1.default.product.count({
        where: {
            status: {
                not: client_1.ProductStatus.DELETED,
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
});
const getRelatedProductsByProductSlugFromDB = (productSlug, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    const { categories, name } = product;
    const whereConditions = {
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
    const wishListedProductIds = [];
    if (authUser) {
        const wishListedItems = yield prisma_1.default.wishListItem.findMany({
            where: {
                customerId: authUser.customerId,
            },
        });
        wishListedItems.forEach((item) => wishListedProductIds.push(item.productId));
    }
    const products = yield prisma_1.default.product.findMany({
        where: whereConditions,
        select: constant_1.productSelect,
        take: 6,
    });
    const data = products.map((product) => {
        // Calculate stock
        product.availableQuantity = product.variants.length
            ? product.variants.reduce((p, c) => p + c.availableQuantity, 0)
            : product.availableQuantity;
        // Shot description
        product.description = product.description.slice(0, 300);
        product.variants = product.variants.filter((variant) => variant.isHighlighted);
        const upd = Object.assign(Object.assign({}, product), { isWishListed: wishListedProductIds.includes(product.id) });
        return upd;
    });
    return data;
});
const getProductBySlugForCustomerViewFromDB = (authUser, slug) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
        where: {
            slug,
            status: client_1.ProductStatus.ACTIVE,
        },
        include: {
            categories: true,
            specifications: true,
            variants: {
                include: {
                    attributes: true,
                },
            },
            images: true,
        },
    });
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    let isWishListed = false;
    if (authUser) {
        isWishListed = (yield prisma_1.default.wishListItem.findUnique({
            where: {
                productId_customerId: {
                    customerId: authUser.customerId,
                    productId: product.id,
                },
            },
        }))
            ? true
            : false;
    }
    // Increment product views count1
    prisma_1.default.product.update({
        where: {
            id: product.id,
        },
        data: {
            viewsCount: {
                increment: 1,
            },
        },
    });
    console.dir(product, { depth: null });
    return Object.assign(Object.assign({}, product), { isWishListed });
});
const getFeaturedProductsFromDB = (paginationOptions, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, sortOrder, orderBy } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const products = yield prisma_1.default.product.findMany({
        where: {
            isFeatured: true,
            status: client_1.ProductStatus.ACTIVE,
            availableQuantity: {
                gt: 0,
            },
        },
        select: constant_1.productSelect,
        skip,
        take: limit,
        orderBy: {
            [orderBy]: sortOrder,
        },
    });
    const wishListedProductIds = [];
    if (authUser) {
        const wishListedItems = yield prisma_1.default.wishListItem.findMany({
            where: {
                customerId: authUser.customerId,
            },
        });
        wishListedItems.forEach((item) => wishListedProductIds.push(item.productId));
    }
    const data = products.map((product) => {
        // Calculate stock
        product.availableQuantity = product.variants.length
            ? product.variants.reduce((p, c) => p + c.availableQuantity, 0)
            : product.availableQuantity;
        // Shot description
        product.description = product.description.slice(0, 300);
        product.variants = product.variants.filter((variant) => variant.isHighlighted);
        const upd = Object.assign(Object.assign({}, product), { isWishListed: wishListedProductIds.includes(product.id) });
        return upd;
    });
    const totalResult = yield prisma_1.default.product.count({
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
});
const getNewArrivalProductsFromDB = (paginationOptions, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, sortOrder, orderBy } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const whereConditions = {
        status: client_1.ProductStatus.ACTIVE,
        availableQuantity: {
            gt: 0,
        },
    };
    const products = yield prisma_1.default.product.findMany({
        where: whereConditions,
        select: constant_1.productSelect,
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
    const wishListedProductIds = [];
    if (authUser) {
        const wishListedItems = yield prisma_1.default.wishListItem.findMany({
            where: {
                customerId: authUser.customerId,
            },
        });
        wishListedItems.forEach((item) => wishListedProductIds.push(item.productId));
    }
    const data = products.map((product) => {
        // Calculate stock
        product.availableQuantity = product.variants.length
            ? product.variants.reduce((p, c) => p + c.availableQuantity, 0)
            : product.availableQuantity;
        // Shot description
        product.description = product.description.slice(0, 300);
        product.variants = product.variants.filter((variant) => variant.isHighlighted);
        const upd = Object.assign(Object.assign({}, product), { isWishListed: wishListedProductIds.includes(product.id) });
        return upd;
    });
    const totalResult = yield prisma_1.default.product.count({
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
const getStockOutProductsFromDB = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortOrder, orderBy } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const whereConditions = {
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
    const products = yield prisma_1.default.product.findMany({
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
        orderBy: orderBy === "price"
            ? [{ offerPrice: sortOrder }, { price: sortOrder }]
            : {
                [orderBy]: sortOrder,
            },
        take: limit,
        skip,
    });
    const totalResult = yield prisma_1.default.product.count({ where: whereConditions });
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
});
const getCategoryProductsFromDB = (slug, filterQuery, paginationOptions, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma_1.default.category.findUnique({
        where: {
            slug,
        },
    });
    if (!category)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    const { page, limit, skip, orderBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
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
    const validateNumber = (number) => {
        return !isNaN(parseInt(number));
    };
    // If minimum price and max price exist then filter by price range
    if (minPrice &&
        maxPrice &&
        validateNumber(minPrice) &&
        validateNumber(maxPrice)) {
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
    }
    else {
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
    const whereConditions = {
        AND: andConditions,
        status: client_1.ProductStatus.ACTIVE,
        availableQuantity: {
            gt: 0,
        },
    };
    const products = yield prisma_1.default.product.findMany({
        where: whereConditions,
        orderBy: orderBy === "price"
            ? [
                { offerPrice: sortOrder }, // NULLs first by default
                { price: sortOrder },
            ]
            : {
                [orderBy]: sortOrder,
            },
        select: constant_1.productSelect,
        take: limit,
        skip,
    });
    const wishListedProductIds = [];
    if (authUser) {
        const wishListedItems = yield prisma_1.default.wishListItem.findMany({
            where: {
                customerId: authUser.customerId,
            },
        });
        wishListedItems.forEach((item) => wishListedProductIds.push(item.productId));
    }
    const data = products.map((product) => {
        // Calculate stock
        product.availableQuantity = product.variants.length
            ? product.variants.reduce((p, c) => p + c.availableQuantity, 0)
            : product.availableQuantity;
        // Shot description
        product.description = product.description.slice(0, 300);
        product.variants = product.variants.filter((variant) => variant.isHighlighted);
        const upd = Object.assign(Object.assign({}, product), { isWishListed: wishListedProductIds.includes(product.id) });
        return upd;
    });
    const total = yield prisma_1.default.product.count({
        where: { status: client_1.ProductStatus.ACTIVE },
    });
    const totalResult = yield prisma_1.default.product.count({ where: whereConditions });
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
const getBrandProductsFromDB = (name, filterQuery, paginationOptions, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield prisma_1.default.brand.findUnique({
        where: {
            name,
        },
    });
    if (!brand)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Brand not found");
    const { page, limit, skip, orderBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    const { minPrice, maxPrice, category } = filterQuery;
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
                name,
            },
        });
    }
    const validateNumber = (number) => {
        return !isNaN(parseInt(number));
    };
    // If minimum price and max price exist then filter by price range
    if (minPrice &&
        maxPrice &&
        validateNumber(minPrice) &&
        validateNumber(maxPrice)) {
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
    }
    else {
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
    const whereConditions = {
        AND: andConditions,
        status: client_1.ProductStatus.ACTIVE,
        availableQuantity: {
            gt: 0,
        },
    };
    const products = yield prisma_1.default.product.findMany({
        where: whereConditions,
        orderBy: orderBy === "price"
            ? [
                { offerPrice: sortOrder }, // NULLs first by default
                { price: sortOrder },
            ]
            : {
                [orderBy]: sortOrder,
            },
        select: constant_1.productSelect,
        take: limit,
        skip,
    });
    const wishListedProductIds = [];
    if (authUser) {
        const wishListedItems = yield prisma_1.default.wishListItem.findMany({
            where: {
                customerId: authUser.customerId,
            },
        });
        wishListedItems.forEach((item) => wishListedProductIds.push(item.productId));
    }
    const data = products.map((product) => {
        // Calculate stock
        product.availableQuantity = product.variants.length
            ? product.variants.reduce((p, c) => p + c.availableQuantity, 0)
            : product.availableQuantity;
        // Shot description
        product.description = product.description.slice(0, 300);
        product.variants = product.variants.filter((variant) => variant.isHighlighted);
        const upd = Object.assign(Object.assign({}, product), { isWishListed: wishListedProductIds.includes(product.id) });
        return upd;
    });
    const total = yield prisma_1.default.product.count({
        where: { status: client_1.ProductStatus.ACTIVE },
    });
    const totalResult = yield prisma_1.default.product.count({ where: whereConditions });
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
const deleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    yield prisma_1.default.product.delete({
        where: {
            id,
        },
    });
    return null;
});
const softDeleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id,
            status: {
                not: client_1.ProductStatus.DELETED,
            },
        },
    });
    if (!product)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    yield prisma_1.default.product.update({
        where: {
            id,
        },
        data: {
            status: client_1.ProductStatus.DELETED,
        },
    });
    return null;
});
const updateProductStockIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Update variant on variantId existence
        if (payload.variantId) {
            const variant = yield tx.variant.findUnique({
                where: {
                    id: payload.variantId,
                    product: {
                        status: client_1.ProductStatus.DELETED,
                    },
                },
            });
            yield tx.variant.update({
                where: {
                    id: payload.variantId,
                },
                data: {
                    availableQuantity: payload.availableQuantity,
                },
            });
            if (!variant)
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
        }
        else {
            const product = yield tx.product.findUnique({
                where: {
                    id: payload.productId,
                },
            });
            if (!product)
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
            yield tx.product.update({
                where: {
                    id: payload.productId,
                },
                data: {
                    availableQuantity: payload.availableQuantity,
                },
            });
        }
        const product = yield tx.product.findUnique({
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
                    availableQuantity: product.variants.reduce((p, c) => p + c.availableQuantity, 0),
                },
            });
        }
    }));
    return null;
});
const getTopBrandProductsFromDB = (authUser, id) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const products = yield prisma_1.default.product.findMany({
        where: {
            brand: {
                id,
            },
        },
        select: constant_1.productSelect,
        take: 20,
    });
    const wishListedProductIds = [];
    if (authUser) {
        const wishListedItems = yield prisma_1.default.wishListItem.findMany({
            where: {
                customerId: authUser.customerId,
            },
        });
        wishListedItems.forEach((item) => wishListedProductIds.push(item.productId));
    }
    const data = products.map((product) => {
        // Calculate stock
        product.availableQuantity = product.variants.length
            ? product.variants.reduce((p, c) => p + c.availableQuantity, 0)
            : product.availableQuantity;
        // Shot description
        product.description = product.description.slice(0, 300);
        product.variants = product.variants.filter((variant) => variant.isHighlighted);
        const upd = Object.assign(Object.assign({}, product), { isWishListed: wishListedProductIds.includes(product.id) });
        return upd;
    });
    return data;
});
const getMyNotReviewedProductsFromDB = (authUser, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, page, orderBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const whereConditions = {
        order: {
            customer: {
                userId: authUser.id,
            },
        },
        isReviewed: false,
    };
    const data = yield prisma_1.default.orderItem.findMany({
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
    const total = yield prisma_1.default.orderItem.count({
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
});
const getProductVariantsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    const variants = yield prisma_1.default.variant.findMany({
        where: {
            productId: id,
        },
        include: {
            attributes: true,
        },
    });
    return variants;
});
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
exports.default = ProductServices;

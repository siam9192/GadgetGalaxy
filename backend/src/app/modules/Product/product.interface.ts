import { Variant } from "@prisma/client";

export interface ICreateProductPayload {
  name: string;
  description: string;
  brandId?: number;
  warrantyInfo: string;
  price: number;
  offerPrice?: number;
  sku: string;
  availableQuantity: number;
  imagesUrl: string[];
  categoriesId: number[];
  variants?: ICreateVariantPayload[];
  specifications: IProductSpecification[];
}

export interface IUpdateProductPayload {
  name?: string;
  description?: string;
  brandId?: number;
  warrantyInfo?: string;
  price?: number;
  offerPrice?: number;
  sku?: string;
  availableQuantity?: number;
  imagesUrl?: string[];
  categoriesId?: number[];
  variants?: (ICreateVariantPayload & { id?: number; isDeleted?: true })[];
  specifications?: IProductSpecification[];
}

interface ICreateVariantPayload {
  sku: string;
  colorName: string;
  colorCode: string;
  attributes: IVariantAttribute[];
  price: number;
  offerPrice?: number;
  availableQuantity: number;
  isHighlighted: boolean;
}

interface IVariantAttribute {
  name: string;
  value: string;
}

interface IProductSpecification {
  name: string;
  value: string;
}

export interface IManageProductsFilterQuery {
  searchTerm?: string;
  category?: number;
  brand?: number;
  minPrice?: string;
  maxPrice?: string;
}

export interface ISearchProductsFilterQuery {
  searchTerm?: string;
  minPrice?: string;
  maxPrice?: string;
  category?: string;
  brand?: string;
}

export interface IUpdateProductStockPayload {
  productId: number;
  variantId: number;
  availableQuantity: number;
}

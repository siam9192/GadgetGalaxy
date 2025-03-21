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
  imageUrls: string[];
  categoryIds: number[];
  variants?: ICreateVariantPayload[];
  specifications: IProductSpecification[];
}

export interface IUpdateProductPayload {
  name: string;
  description: string;
  brandId?: number;
  warrantyInfo: string;
  price: number;
  offerPrice?: number;
  sku: string;
  availableQuantity: number;
  images: { id?: string; url: string; isDeleted: boolean }[];
  categories: { id: number; isDeleted: boolean }[];
  variants?: IUpdateProductVariantPayload[];
  specifications: IUpdateProductSpecificationPayload[];
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

interface IUpdateProductVariantPayload extends ICreateVariantPayload {
  id?: string;
  isDeleted?: boolean;
  attributes: IVariantAttribute[];
}

interface IUpdateProductSpecificationPayload extends IProductSpecification {
  id?: string;
  isDeleted?: boolean;
}

interface IUpdateProductTagPayload {
  id?: string;
  name: string;
  isDeleted?: boolean;
  isNewAdded?: boolean;
}

interface IUpdateProductSpecificationPayload {
  id?: string;
  name: string;
  value: string;
  isDeleted?: boolean;
  isNewAdded?: boolean;
}

interface IUpdateProductImagePayload {
  id?: string;
  url: string;
  isDeleted?: string;
  isNewAdded: boolean;
}

export interface IProductFilterData {
  searchTerm?: string;
  categories?: string;
  brands?: string;
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

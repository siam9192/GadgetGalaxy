import { Variant } from "@prisma/client";

export interface ICreateProductPayload {
  name: string;
  description: string;
  regularPrice?: number;
  salePrice?: number;
  sku: string;
  stock: number;
  images: string[];
  tags: string[];
  categoryId: string;
  variants?: ICreateVariantPayload[];
  specification: IProductSpecification[];
}

interface ICreateVariantPayload {
  sku: string;
  colorName: string;
  colorCode: string;
  attributes: IVariantAttribute[];
  regularPrice: number;
  salePrice: number;
  stock: number;
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

export interface IUpdateProductPayload {
  id: string;
  name: string;
  description: string;
  brandId?: string;
  regularPrice?: number;
  salePrice?: number;
  stock: number;
  specification: IUpdateProductSpecificationPayload[];
  variants: IUpdateProductVariantPayload[];
  deletedVariantsId: string[];
  deletedVariantAttributesId: string[];
  specifications: IUpdateProductSpecificationPayload[];
  images: IUpdateProductImagePayload[];
  tags: IUpdateProductTagPayload[];
  categoryId: string;
}

interface IUpdateProductVariantPayload extends ICreateVariantPayload {
  id?: string;
  isDeleted?: boolean;
  isNewAdded?: boolean;
  attributes: {
    id: string;
    name: string;
    value: string;
  }[];
}

interface IUpdateProductSpecificationPayload {
  id?: string;
  value: string;
  name: string;
  isDeleted?: boolean;
  isNewAdded?: boolean;
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

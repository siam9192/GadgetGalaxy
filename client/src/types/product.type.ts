export interface IProduct {
  id: number;
  name: string;
  slug: string;
  brandId?: string;
  brand?: TProductBrand;
  categories: TProductCategory[];
  specifications: TProductSpecification[];
  description: string;
  warrantyInfo: string;
  price: number;
  offerPrice: number;
  discountPercentage: number;
  sku: string;
  availableQuantity: number;
  images: TProductImage[];
  variants: TVariant[];
  rating: number;
  status: TProductStatus;
  isFeatured: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type TCardProduct = Pick<
  IProduct,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "images"
  | "price"
  | "offerPrice"
  | "discountPercentage"
  | "availableQuantity"
  | "rating"
  | "variants"
>;

export type TProductCategory = {
  id: number;
  name: string;
};
export type TProductImage = {
  id: string;
  url: string;
};

export type TProductBrand = {
  id: number;
  name: string;
};

export type TProductSpecification = {
  name: string;
  value: string;
};

export type TVariant = {
  id: string;
  productId: number;
  sku: string;
  colorName: string;
  colorCode: string;
  attributes: TVariantAttribute[];
  price: number;
  offerPrice?: number;
  discountPercentage: string;
  availableQuantity: string;
  isHighlighted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TVariantAttribute = {
  name: string;
  value: string;
};

export type TProductStatus = `${EProductStatus}`;

enum EProductStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
}

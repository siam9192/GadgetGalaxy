import { IOrderItem } from "./order.type";
import { TVariantAttribute } from "./product.type";

export interface IMyNotReviewedItem {
  id: string;
  orderId: number;
  productId: number;
  variantId: any;
  productName: string;
  imageUrl: string;
  colorName: any;
  colorCode: any;
  attributes: any;
  quantity: number;
  price: number;
  totalAmount: number;
  isReviewed: boolean;
}

export interface IProductReview {
  id: number;
  comment: string;
  imagesUrl: string[];
  reviewer: {
    name: string;
    profilePhoto: string;
  };
  item:IOrderItem
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMyProductReview {
  id: number;
  comment: string;
  imagesUrl: string[];
  rating: number;
  item: Item;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  orderId: number;
  productId: number;
  variantId: any;
  productName: string;
  colorName: any;
  colorCode: any;
  attributes: TVariantAttribute[];
  quantity: number;
  price: number;
  totalAmount: number;
  isReviewed: boolean;
}

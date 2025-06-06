import { SearchParams } from "next/dist/server/request/search-params";
import { ICartItem } from "./cartItem.type";
import { Params } from "next/dist/server/request/params";

export enum ECardViewType {
  GRID = "grid",
  LIST = "list",
}

export type TCardViewType = `${ECardViewType}`;

export type TPricing = {
  price: number;
  offerPrice?: number;
};

export interface IParam {
  name: string;
  value: string | number | null;
}

export type TSearchKeywordData = {
  type: "product" | "category";
  name: string;
  imageUrl: string;
  price?: number;
  offerPrice?:number
  stock?: number;
  rating?:number
  hierarchySte?: string;
};

export type TMyUtilsCount = {
  cartItem: number;
  wishListItem: number;
  newNotification: number;
};

export type TCheckoutData = {
  subtotal: number;
  grandTotal: number;
  discountTotal: number;
  items: ICartItem[];
  discountCode: string | null;
};



export interface ILayoutProps {
  children:React.ReactNode
}

export interface IPageProps {
  searchParams:Promise<SearchParams>,
  params:Promise<Record<string,string>>
}
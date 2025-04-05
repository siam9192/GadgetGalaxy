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
  type: "product"|"category",
  name: string,
  imageUrl: string,
  price?: number,
  stock?: number,
  hierarchySte?:string,
}
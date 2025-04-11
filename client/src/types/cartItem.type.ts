import { IProduct, TVariant } from "./product.type";

export interface ICartItem {
  id: string;
  product: Pick<
    IProduct,
    "id" | "name" | "price" | "offerPrice" | "images" | "availableQuantity"
  > & { variant: TVariant };
  quantity: number;
}

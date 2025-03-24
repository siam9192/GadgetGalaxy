export interface ICreateProductReviewPayload {
  orderItemId: string;
  comment: string;
  imagesUrl?:string[]
  rating: number;
}

export interface ICreateReviewResponsePayload {
  id: number;
  comment: string;
}

export interface IUpdateProductReviewPayload {
  id: number;
  comment: string;
  rating: number;
}

export interface IManageReviewFilterQuery {
  productId?: number;
  startDate?: string;
  endDate?: string;
}

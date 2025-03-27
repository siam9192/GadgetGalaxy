export interface ICreateProductReviewPayload {
  orderItemId: string;
  comment: string;
  imagesUrl?: string[];
  rating: number;
}

export interface ICreateReviewResponsePayload {
  id: number;
  comment: string;
}

export interface IUpdateProductReviewPayload {
  comment?: string;
  rating?: number;
  imagesUrl: string[];
}

export interface IManageReviewFilterQuery {
  productId?: number;
  startDate?: string;
  endDate?: string;
}

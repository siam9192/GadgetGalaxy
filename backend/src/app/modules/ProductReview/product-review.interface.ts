export interface ICreateProductReviewPayload {
  orderItemId: string;
  comment: string;
  rating: number;
}

export interface ICreateReviewResponsePayload {
  reviewId: string;
  comment: string;
}

export interface IUpdateProductReviewPayload {
  reviewId: string;
  comment: string;
  rating: number;
}

"use client";
import React, { useEffect, useState } from "react";
import Rating from "../ui/Rating";
import useScreen from "@/hooks/useScreen";
import { IProductReview } from "@/types/product-review.type";
interface IProps {
  review: IProductReview;
}
const ProductReviewCard = ({ review }: IProps) => {
  const { screenType } = useScreen();
  const showLength = screenType === "lg" ? 6 : screenType === "md" ? 5 : 4;

  return (
    <div className="p-3 border-2 rounded-lg border-blue-100 h-fit">
      <h6 className="font-medium">
        <span className="opacity-70 text-sm">Reviewed by</span> {review.reviewer.name}
      </h6>

      <div className=" mt-3 flex flex-wrap gap-3">
        {review.imagesUrl && review.imagesUrl.length ? (
          <div className=" mt-3 flex flex-wrap gap-3">
            {review.imagesUrl.slice(0, showLength).map((_, index) => (
              <img key={index} src={_} alt="" className="object-cover size-20  aspect-square" />
            ))}
            {review.imagesUrl.length - showLength > 0 ? (
              <div className="size-20 flex flex-col justify-center items-center bg-gray-800  backdrop-blur-lg text-white text-sm">
                +{review.imagesUrl.length - showLength} more
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="mt-3">
        <Rating rating={review.rating} />
        <p className="text-sm">"{review.comment}"</p>
        <p className="mt-2 text-end font-medium text-gray-700">
          {new Date(review.createdAt).toDateString()}
        </p>
      </div>
    </div>
  );
};

export default ProductReviewCard;

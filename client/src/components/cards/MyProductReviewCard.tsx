"use client";
import React, { useEffect, useState } from "react";
import useScreen from "@/hooks/useScreen";
import { TbCurrencyTaka } from "react-icons/tb";
import { IProductReview } from "@/types/product-review.type";
import ProductRating from "../ui/ProductRating";
import EditProductReview from "../ui/EditProductReview";
interface IProps {
  review: IProductReview;
}
const MyProductReviewCard = ({ review }: IProps) => {
  const { screenType } = useScreen();
  const showLength = screenType === "lg" ? 6 : screenType === "md" ? 5 : 4;

  const attributes = review.item.attributes || [];
  const attStr = [review.item.colorName, ...attributes.map((attr) => attr.value)].join("|");

  return (
    <div className="mt-3 p-3 border-2 rounded-lg border-blue-100 bg-white">
      <p className="mt-2 text-end font-medium text-gray-700 ">
        {new Date(review.createdAt).toDateString()}
      </p>
      <div className="mt-3 flex items-center  gap-2 p-2 border-2 border-gray-700/10 w-fit rounded-lg">
        <img
          src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
          alt=""
          className="size-20"
        />
        <div>
          <h1 className="text-lg font-medium">{review.item.productName}</h1>
          <p className="text-gray-700">{attStr}</p>
          <h3 className="flex items-center text-primary">
            <span className="text-2xl ">
              <TbCurrencyTaka />
            </span>
            <span className="font-medium  ">{review.item.price}</span>
          </h3>
        </div>
      </div>
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
      <div className="mt-3">
        <ProductRating rating={review.rating} />
        <p className="text-sm">"{review.comment}"</p>
      </div>

      <div className="mt-2 flex items-center justify-end gap-2">
        <EditProductReview review={review} />
      </div>
    </div>
  );
};

export default MyProductReviewCard;

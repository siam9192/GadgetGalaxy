"use client";
import React, { useEffect, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import PostProductReview from "../ui/PostProductReview";
import { IMyNotReviewedItem } from "@/types/product-review.type";
interface IProps {
  item: IMyNotReviewedItem;
}
const YetToReviewCard = ({ item }: IProps) => {
  const [isClient, setIsClient] = useState(false);

  // Use effect for ssr = false for this component
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isClient) return;
      setIsClient(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  if (!isClient) return null;

  return (
    <div className="md:p-5 p-3 bg-white  h-fit ">
      <div className="flex  md:gap-5 gap-3">
        <img
          src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
          alt=""
          className=" aspect-square size-24"
        />
        <div>
          <div className="mt-2">
            <h1 className="md:text-xl font-medium ">{item.productName}</h1>
          </div>

          <p className="font-medium text-sm text-gray-700  rounded-full">128GB|Black|UK</p>
          <h1 className="flex items-center text-primary  font-semibold font-primary ">
            <span className="text-xl  font-medium">
              <FaBangladeshiTakaSign />
            </span>
            <span className="text-xl ">{item.price}</span>
          </h1>
          <p className="text-sm text-primary">
            Delivered at {new Date("2024-03-23").toDateString()}
          </p>
        </div>
      </div>

      <div className="mt-1 text-end ">
        <PostProductReview id={item.id} />
      </div>
    </div>
  );
};

export default YetToReviewCard;

import React from "react";
import ProductReviewCard from "../cards/ProductReviewCard";
import useScreen from "@/hooks/useScreen";

const ProductReviews = () => {
  return (
    <div id="product-reviews" className="p-5 bg-white">
      <h1 className="text-2xl  font-primary font-semibold  pb-2 border-b-4 pr-3 border-primary w-fit">
        Reviews <span className="text-info text-xl">(500)</span>
      </h1>
      <div className="mt-5 grid grid-cols-1 gap-4">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <ProductReviewCard key={index} />
        ))}
      </div>
      <div className="mt-3 text-end">
        <button className="text-info  font-medium">View All</button>
      </div>
    </div>
  );
};

export default ProductReviews;

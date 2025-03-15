import RecentViewProductCard from "@/components/cards/RecentViewProductCard";
import React from "react";

const RecentlyViewedProducts = () => {
  return (
    <div className="p-5 bg-white">
      <h1 className="text-xl uppercase text-center font-semibold font-primary pb-2 border-b-2 border-gray-700/20 ">
        Recently Viewed
      </h1>
      <div className="mt-5 grid lg:grid-cols-1 md:grid-cols-2  grid-cols-1 gap-4">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <RecentViewProductCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;

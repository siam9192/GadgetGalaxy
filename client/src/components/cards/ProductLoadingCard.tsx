import React from "react";

const ProductLoadingCard = () => {
  return (
    <div className="min-h-72  p-2 bg-white ">
      <div className="bg-gray-300 h-48  animate-pulse"></div>
      <div>
        <div className="h-3 rounded-full bg-gray-300 animate-pulse mt-3 "></div>
        <div className="h-3 rounded-full bg-gray-300 animate-pulse mt-3 w-[70%] "></div>
        <div className="flex justify-end">
          <div className="h-3 rounded-full bg-gray-300 animate-pulse mt-3 w-[60%] "></div>
        </div>
        <div className="h-3 rounded-full bg-gray-300 animate-pulse mt-3 w-[60%] "></div>
      </div>
    </div>
  );
};

export default ProductLoadingCard;

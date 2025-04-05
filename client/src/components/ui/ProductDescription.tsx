import React from "react";

const ProductDescription = ({description}:{description:string}) => {
  return (
    <div id="product-description" className="p-5 bg-white">
      <h1 className="text-2xl  font-primary font-semibold  pb-2 border-b-4 pr-3 border-primary w-fit">
        Description
      </h1>
      <div className="mt-3 text-gray-700 text-sm">
     {
      description
     }
      </div>
    </div>
  );
};

export default ProductDescription;

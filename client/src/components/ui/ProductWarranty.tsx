import React from "react";

const ProductWarranty = ({ warranty }: { warranty: string }) => {
  return (
    <div id="product-warranty" className="p-5 bg-white">
      <h1 className="text-2xl  font-primary font-semibold  pb-2 border-b-4 pr-3 border-primary w-fit">
        Warranty
      </h1>
      <div className="mt-3  space-y-2">
        <h3 className="text-xl font-medium ">{warranty}</h3>
        <p className="text-gray-700 text-sm">
          Explore our Warranty Policy page for detailed information about our warranty coverage.
        </p>
      </div>
    </div>
  );
};

export default ProductWarranty;

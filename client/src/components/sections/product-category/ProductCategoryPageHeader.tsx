import React, { Suspense } from "react";
import ResponsiveSearchPageFilterBox from "@/components/ui/ResponsiveSearchPageFilterBox";
import ProductViewTypeButton from "@/components/ui/ProductViewTypeButton";
import ResponsiveProductCategoryPageFilterBox from "@/components/ui/ResponsiveProductCategoryPageFilterBox";
const ProductCategoryPageHeader = () => {
  return (
    <div>
      <div className="md:p-5 p-2 md:block hidden bg-white md:flex justify-between items-center">
        <h1 className="text-3xl md:block hidden text-primary font-medium">Filter Products</h1>
        <div>
          <p className="font-medium">Showing 23 of 100 products</p>
        </div>
        <div className="flex items-center gap-4">
          <Suspense>
            <ProductViewTypeButton />
          </Suspense>
          <select name="" id="" className="px-2 py-3 min-w-32 bg-blue-50 outline-none ">
            <option value="">Sort by latest</option>
            <option value="">Sort by latest</option>
            <option value="">Sort by latest</option>
          </select>
        </div>
      </div>
      <div className="p-2 md:hidden block bg-white flex flex-col  gap-2">
        <div>
          <p className="font-medium">Showing 23 of 100 products</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <ResponsiveProductCategoryPageFilterBox />
          <Suspense>
            <ProductViewTypeButton />
          </Suspense>
          <select name="" id="" className="px-2 py-3 min-w-32 bg-blue-50 outline-none ">
            <option value="">Sort by latest</option>
            <option value="">Sort by latest</option>
            <option value="">Sort by latest</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryPageHeader;

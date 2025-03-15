import ProductBasicInfo from "@/components/sections/product/ProductBasicInfo";
import ProductDetails from "@/components/sections/product/ProductDetails";
import ProductImageGallery from "@/components/sections/product/ProductImageGallery";
import RecentlyViewedProducts from "@/components/sections/product/RecentlyViewedProducts";
import RelatedProducts from "@/components/sections/product/RelatedProducts";
import React from "react";
import { LuMoveLeft } from "react-icons/lu";

const page = () => {
  return (
    <div className="min-h-screen md:py-5 py-2">
      <div className="p-5 bg-white">
        <div className="flex items-center gap-2">
          <button className="text-2xl p-2 bg-gray-50">
            <LuMoveLeft />
          </button>
          <p className="  opacity-60 font-medium">Home/Products/Product-1</p>
        </div>
      </div>
      <div className="mt-5 grid lg:grid-cols-2  grid-cols-1 gap-5">
        <ProductImageGallery />
        <ProductBasicInfo />
      </div>
      <div className="mt-5  grid lg:grid-cols-6  grid-cols-1 gap-10 ">
        <div className="lg:col-span-4">
          <ProductDetails />
        </div>
        <div className="lg:col-span-2">
          <RecentlyViewedProducts />
        </div>
      </div>
      <RelatedProducts />
    </div>
  );
};

export default page;

import ProductBasicInfo from "@/components/sections/product/ProductBasicInfo";
import ProductDetails from "@/components/sections/product/ProductDetails";
import ProductImageGallery from "@/components/sections/product/ProductImageGallery";
import RecentlyViewedProducts from "@/components/sections/product/RecentlyViewedProducts";
import RelatedProducts from "@/components/sections/product/RelatedProducts";
import React from "react";

import { getProductDetails } from "@/services/product.service";
import AddAsRecentView from "@/components/sections/product/AddAsRecentView";
import NavigateTab from "@/components/ui/NavigateTab";
import { IPageProps } from "@/types/util.type";

const page = async ({ params }: IPageProps) => {
  const { slug } = await params;
  const data = await getProductDetails(slug);

  const product = data?.data;
  if (!product) {
    return (
      <div className="h-[70vh] p-5">
        <p className="text-xl ">This product may have been deleted,moved or made unavailable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:py-5 py-2">
      <NavigateTab />
      <div className="mt-5 grid lg:grid-cols-2  grid-cols-1 gap-5">
        <ProductImageGallery images={product.images} />
        <ProductBasicInfo product={product} />
      </div>
      <div className="mt-5  grid lg:grid-cols-6  grid-cols-1 gap-10 ">
        <div className="lg:col-span-4">
          <ProductDetails product={product} />
        </div>
        <div className="lg:col-span-2">
          <RecentlyViewedProducts />
        </div>
      </div>
      <RelatedProducts slug={slug} />
      <AddAsRecentView id={product.id} />
    </div>
  );
};

export default page;

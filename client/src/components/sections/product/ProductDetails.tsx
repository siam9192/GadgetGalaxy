"use client";
import ProductDescription from "@/components/ui/ProductDescription";
import ProductReviews from "@/components/ui/ProductReviews";
import ProductSpecification from "@/components/ui/ProductSpecification";
import ProductWarranty from "@/components/ui/ProductWarranty";
import { IProduct } from "@/types/product.type";
import React, { useEffect, useState } from "react";

interface IProps {
  product:IProduct
}

const ProductDetails = ({product}:IProps) => {
  const [active, setActive] = useState(0);
  const tabs = [
    {
      name: "Specification",
      eleId: "product-specification",
    },
    {
      name: "Description",
      eleId: "product-description",
    },
    {
      name: "Warranty",
      eleId: "product-warranty",
    },
    {
      name: "Reviews",
      eleId: "product-reviews",
    },
  ];

  const handelTabChange = (index: number) => {
    setActive(index);
  };

  useEffect(() => {
    if (active === 0) return;
    const element = document.getElementById(tabs[active].eleId);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  return (
    <div>
      <div className="flex flex-wrap md:justify-start  justify-center items-center gap-2 mb-2 border-b-2 border-gray-500/20  md:scale-100 scale-90">
        {tabs.map((tab, index) => (
          <button
            onClick={() => handelTabChange(index)}
            key={index}
            className={`px-4 py-3   border-2 border-gray-900/20 border-b-0  rounded-t-md font-semibold  ${active === index ? "bg-primary text-white" : "text-black"} active:bg-blue-600 duration-75 `}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-8">
        <ProductSpecification specifications={product.specifications}/>
        <ProductDescription  description={product.description}/>
        <ProductWarranty  warranty={product.warrantyInfo}/>
        <ProductReviews />
      </div>
    </div>
  );
};

export default ProductDetails;

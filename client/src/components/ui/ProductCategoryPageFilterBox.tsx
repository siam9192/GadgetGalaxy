"use client";
import React, { useState } from "react";
import RangeSlider from "../range-slider/RangeSlider";
import { useGetCategoryRelatedBrandsQuery } from "@/redux/features/brand/brand.api";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { urlSearch } from "@/utils/helpers";

type TPriceRange = {
  min: null | number;
  max: null | number;
};

const ProductCategoryPageFilterBox = () => {
  const [priceRange, setPriceRange] = useState<TPriceRange>({ min: null, max: null });
  const { slug } = useParams();

  const { data: brandData } = useGetCategoryRelatedBrandsQuery(slug as string);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const brands = brandData?.data || [];
  const router = useRouter();
  const searchParams = useSearchParams();
  const handelFilter = () => {
    const params = [
      {
        name: "brand",
        value: brands.find((b) => b.id === selectedBrand)?.name || "",
      },
      {
        name: "minPrice",
        value: priceRange.min,
      },
      {
        name: "maxPrice",
        value: priceRange.max,
      },
    ];

    router.push(urlSearch(searchParams, params));
  };

  return (
     <div className="h-fit  w-full bg-blue-100 p-5">
      <div className="mt-5 space-y-4">
        <div className="bg-white p-4">
          <h6 className="uppercase">Filter By Price</h6>
          <div className="mt-5">
            <RangeSlider onChange={(value) => setPriceRange(value)} />
          </div>
        </div>
        <div className="bg-white p-4">
          <h6 className="uppercase font-medium">Brands</h6>
          <p className="text-end text-primary font-medium">
            {brands.find((b) => b.id === selectedBrand)?.name}
          </p>
          <div className="mt-5 max-h-[400px] overflow-y-auto min-h-60">
            {brands.length ? (
              brands.map((_, index) => (
                <div
                  onClick={() => setSelectedBrand(_.id === selectedBrand ? null : _.id)}
                  key={index}
                  className={`py-2 flex items-center gap-2 ${selectedBrand === _.id ? "bg-blue-50" : ""} hover:cursor-pointer`}
                >
                  <img
                    src={
                      _.logoUrl ||
                      "https://gadgetz.com.bd/wp-content/uploads/2022/01/Havit-logo.png"
                    }
                    alt={_.name}
                    className="w-1/5"
                  />
                  <p className="text-lg text-gray-800 opacity-60">{_.name}</p>
                </div>
              ))
            ) : (
              <p>No related brands</p>
            )}
          </div>
        </div>
   
      </div>
      <div className="mt-5">
        <button onClick={handelFilter} className="w-full py-3 bg-primary text-white ">
          Filter
        </button>
      </div>
    </div>
  );
};

export default ProductCategoryPageFilterBox;

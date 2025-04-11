"use client";
import React, { useState } from "react";
import RangeSlider from "../range-slider/RangeSlider";
import { useGetCategoryRelatedBrandsQuery } from "@/redux/features/brand/brand.api";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { urlSearch } from "@/utils/helpers";
import { useGetBrandRelatedCategoriesQuery } from "@/redux/features/category/category.api";
import { defaultImagesUrl } from "@/utils/constant";

type TPriceRange = {
  min: null | number;
  max: null | number;
};

const ProductBrandPageFilterBox = () => {
  const { name } = useParams();

  const { data: catData } = useGetBrandRelatedCategoriesQuery(name as string);

  const searchParams = useSearchParams();

  const categories = catData?.data || [];

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<TPriceRange>({ min: null, max: null });
  const router = useRouter();

  const handelFilter = () => {
    const params = [
      {
        name: "category",
        value: categories.find((b) => b.id === selectedCategory)?.name || "",
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
    <div className="lg:h-fit h-full  w-full bg-blue-100 p-5">
      <div className="mt-5 space-y-4">
        <div className="bg-white p-4">
          <h6 className="uppercase">Filter By Price</h6>
          <div className="mt-5">
            <RangeSlider onChange={(value) => setPriceRange(value)} />
          </div>
        </div>
        <div className="bg-white p-4">
          <h6 className="uppercase font-medium">Categories</h6>
          <p className="text-end text-primary font-medium">
            {categories.find((b) => b.id === selectedCategory)?.name}
          </p>
          <div className="mt-5 max-h-[400px] overflow-y-auto min-h-60">
            {categories.length ? (
              categories?.map((_, index) => (
                <div
                  onClick={() => setSelectedCategory(_.id === selectedCategory ? null : _.id)}
                  key={index}
                  className={`py-2 flex items-center gap-2 ${selectedCategory === _.id ? "bg-blue-50" : ""} hover:cursor-pointer`}
                >
                  <img
                    src={defaultImagesUrl.category}
                    alt=""
                    className="size-8 scale-90
                          "
                  />
                  <h6 className="text-sm opacity-60">{_.name}</h6>
                </div>
              ))
            ) : (
              <p>No related category</p>
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

export default ProductBrandPageFilterBox;

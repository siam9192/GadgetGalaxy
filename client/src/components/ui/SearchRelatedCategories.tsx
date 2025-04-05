"use client";
import { useGetSearchRelatedCategoriesQuery } from "@/redux/features/category/category.api";
import { ICategory } from "@/types/category.type";
import { defaultImagesUrl } from "@/utils/constant";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchRelatedCategories = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";

  const { data, refetch } = useGetSearchRelatedCategoriesQuery([
    { name: "searchTerm", value: searchTerm },
  ]);
  useEffect(() => {
    refetch();
  }, [searchParams]);

  const categories = data?.data;

  return (
    <div className="bg-white p-4">
      <h6 className="uppercase font-medium">Categories</h6>
      <div className="mt-5 max-h-[400px] overflow-y-auto">
        {categories?.map((_, index) => (
          <div key={index} className="py-2 flex items-center gap-2">
            <img
              src={defaultImagesUrl.category}
              alt=""
              className="size-8 scale-90
                 "
            />
            <h6 className="text-sm opacity-60">{_.name}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchRelatedCategories;

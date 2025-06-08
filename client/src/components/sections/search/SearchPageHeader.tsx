"use client";
import React, { Suspense } from "react";
import ResponsiveSearchPageFilterBox from "@/components/ui/ResponsiveSearchPageFilterBox";
import ProductViewTypeButton from "@/components/ui/ProductViewTypeButton";
import { TMeta } from "@/types/response.type";
import { useRouter } from "next/navigation";
import { getParamsToString } from "@/utils/helpers";

interface IProps {
  meta: TMeta;
}
const SearchPageHeader = ({ meta }: IProps) => {
  const startFrom = (meta.page - 1) * meta.limit;
  const endAt = Math.min(meta.page * meta.limit, meta.totalResult);
  const router = useRouter();
  const sortOptions = [
    {
      display: "Default sorting",
      value: "",
    },
    {
      display: "Price (H-L)",
      value: "price_desc",
    },
    {
      display: "Price (L-H)",
      value: "price_asc",
    },
    {
      display: "Name (A-Z)",
      value: "name_asc",
    },
    {
      display: "Name (Z-A)",
      value: "name_desc",
    },
    {
      display: "Rating (H-L)",
      value: "rating_desc",
    },
    {
      display: "Rating (L-H)",
      value: "rating_asc",
    },
  ];

  const handelSorting = (value: string) => {
    let order = "";
    let by = "";

    if (value && value.includes("_")) {
      const split = value.split("_");
      by = split[0];
      order = split[1];
    }

    const params = [
      {
        name: "orderBy",
        value: by,
      },

      {
        name: "sortOrder",
        value: order,
      },
    ];

    router.push(getParamsToString(params));
  };

  return (
    <div>
      <div className="md:p-5 p-2 lg:block hidden bg-white lg:flex justify-between items-center">
        <h1 className="text-3xl md:block hidden text-primary font-medium">Filter Products</h1>
        <div>
          <p className="font-medium ">
            Showing {startFrom}-{endAt} of {meta.totalResult} products
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Suspense>
            <ProductViewTypeButton />
          </Suspense>
          <select
            onChange={(e) => handelSorting(e.target.value)}
            className="px-2 py-3 min-w-32 bg-blue-50 outline-none "
          >
            {sortOptions.map((op) => (
              <option value={op.value} key={op.value}>
                {op.display}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-2 lg:hidden block bg-white flex flex-col  gap-2">
        <div>
          <p className="font-medium">
            Showing {startFrom}-{endAt} of {meta.totalResult} products
          </p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <ResponsiveSearchPageFilterBox />
          <Suspense>
            <ProductViewTypeButton />
          </Suspense>
          <select
            onChange={(e) => handelSorting(e.target.value)}
            className="px-2 py-3 min-w-32 bg-blue-50 outline-none "
          >
            {sortOptions.map((op) => (
              <option value={op.value} key={op.value}>
                {op.display}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchPageHeader;

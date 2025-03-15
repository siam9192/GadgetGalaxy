import ShowSearchProducts from "@/components/sections/search/ShowSearchProducts";
import ProductsPagination from "@/components/ui/ProductsPagination";
import React from "react";
import { PageProps } from "../../../../../.next/types/app/layout";

const page = async ({ searchParams }: PageProps) => {
  return (
    <div className="bg-blue-100 md:p-5 p-2">
      <ShowSearchProducts searchParams={await searchParams} />
      <ProductsPagination />
    </div>
  );
};

export default page;

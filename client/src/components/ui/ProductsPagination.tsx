"use client";
import React, { useEffect, useState } from "react";
import Pagination from "../pagination/Pagination";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { urlSearch } from "@/utils/helpers";
import { TMeta } from "@/types/response.type";
interface IProps {
  meta: TMeta;
}
const ProductsPagination = ({ meta }: IProps) => {
  console.log(meta)
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handelPageChange = (page: number) => {
    router.push(pathname + urlSearch(searchParams, [{ name: "page", value: page }]));
  };
  const [page, setPage] = useState(meta.page);
  

  return (
    <div className="mt-5 p-5 bg-white  lg:shadow-none shadow-xl">
      <Pagination {...meta} onPageChange={handelPageChange} />
    </div>
  );
};

export default ProductsPagination;

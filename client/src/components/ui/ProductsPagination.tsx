"use client";
import React from "react";
import Pagination from "../pagination/Pagination";

const ProductsPagination = () => {
  return (
    <div className="mt-5 p-5 bg-white  lg:shadow-none shadow-xl">
      <Pagination total={20} totalResult={30} limit={5} page={3} onPageChange={() => {}} />
    </div>
  );
};

export default ProductsPagination;

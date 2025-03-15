"use client";
import MyProductReviewCard from "@/components/cards/MyProductReviewCard";
import Pagination from "@/components/pagination/Pagination";
import Select from "@/components/select/Select";
import React from "react";

const page = () => {
  const sortOptions = [
    {
      display: "Sort by latest (desc-asc)",
      value: "la",
    },

    {
      display: "Sort by latest (asc-desc)",
      value: "la",
    },

    {
      display: "Sort by amount (asc-desc)",
      value: "la",
    },
    {
      display: "Sort by amount (desc-asc)",
      value: "la",
    },
  ];
  return (
    <div>
      <div className="mt-5 flex justify-end">
        <div className="lg:w-1/3  ">
          <Select options={sortOptions} />
        </div>
      </div>
      <div className="mt-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <MyProductReviewCard key={index} />
        ))}
      </div>
      <div className="mt-5 flex justify-center">
        <Pagination total={30} totalResult={29} page={1} limit={4} onPageChange={() => {}} />
      </div>
    </div>
  );
};

export default page;

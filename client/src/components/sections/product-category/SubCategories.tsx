"use client";
import CategoryCard from "@/components/cards/CategoryCard";
import { useGetSubCategoriesQuery } from "@/redux/features/category/category.api";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const SubCategories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {slug} =useParams()
  const {data} = useGetSubCategoriesQuery(slug as string)
  const categories =  data?.data||[]
  if(!categories.length) return null
  return (
    <div className=" md:my-5 my-2 p-5 bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl from-primary font-medium uppercase">
          Sub <span className="text-info">Categories</span>
        </h1>
        <button
          onClick={() => setIsOpen((p) => !p)}
          className={`p-2 text-2xl bg-blue-50 rounded-full ${isOpen ? "rotate-180" : ""} transition-transform duration-200`}
        >
          <FaChevronDown />
        </button>
      </div>
      <div
        className={`${isOpen ? "h-[30vh] overflow-y-auto " : "h-0 overflow-hidden"}  transition-all duration-500 no-scrollbar`}
      >
        <div className=" mt-5 grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-5 ">
          {categories.map((_, index) => (
            <CategoryCard category={_} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategories;

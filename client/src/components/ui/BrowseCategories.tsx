"use client";
import React, { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import BrowseCategory from "./BrowseCategory";
import { categories } from "../../../data/categories";
import { ICategory } from "@/types/category.type";
import { getAllVisibleCategories } from "@/services/category.service";

interface IProps {
  isLast: boolean;
  category: ICategory;
}
const BrowseCategories = () => {
  const [isHover, setIsHover] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  const total = categories.length;
  async function fetchCategories() {
    try {
      const cats = await getAllVisibleCategories();
      if (cats && cats.length) {
        setCategories(cats);
      }
    } catch (error) {
      console.log("Browse categories fetch problem!");
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="relative hover:cursor-pointer"
    >
      <div className=" flex items-center  gap-2  bg-primary text-white  px-2 py-3">
        <span className="text-3xl">
          <IoMenu />
        </span>
        <p className="  font-medium text-xl">Browse Categories</p>
      </div>

      {isHover ? (
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="absolute left-0 top-14 no-scrollbar overflow-scroll w-full bg-white z-40  "
        >
          {categories.map((_, index) => (
            <BrowseCategory category={_} isLast={index + 1 === total} key={index} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default BrowseCategories;

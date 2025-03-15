"use client";
import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import BrowseCategory from "./BrowseCategory";
import { categories } from "../../../data/categories";

interface ICategory {
  name: string;
  slug: string;
  imageUrl: string;

  subCategories: ICategory[];
}
interface IProps {
  isLast: boolean;

  category: ICategory;
}
const BrowseCategories = () => {
  const [isHover, setIsHover] = useState(false);

  const total = 20;
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
      {/* {
       active !==null && <div className='absolute left-[100%] top-14 w-lg h-[500px] overflow-y-auto no-scrollbar bg-white z-40 py-2 transition-opacity duration-100'>
               {
                Array.from({length:total}).map((_,index)=>(
                     <button key={index} className={`flex items-center justify-between font-secondary py-3 w-full ${index+1 !== total ? ' border-b border-gray-600/10':null} hover:bg-gray-100 px-3 group`}>
                    <div className='gap-2 flex items-center'>
                    <span className='text-2xl'>
                      <SlScreenSmartphone />
                      </span>
                      <p className=''>
                        Smartphones
                      </p>
                    </div>
                      <span>
                      <FaAngleRight />
                      </span>
                     </button>
                ))
            }
        </div>
    } */}
    </div>
  );
};

export default BrowseCategories;

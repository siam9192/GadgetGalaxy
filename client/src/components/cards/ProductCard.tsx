import Link from "next/link";
import React from "react";
import { GoCheck } from "react-icons/go";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { LuHeart, LuSearch } from "react-icons/lu";
import { ProductQuickView } from "../ui/ProductQuickView";
import ProductCardContainer from "../container/ProductCardContainer";
interface IProps {
  index?: number;
}
const ProductCard = ({ index }: IProps) => {
  return (
    <div
      className={`md:p-3 p-2 bg-white shadow-xl relative  overflow-hidden hover:cursor-pointer product-card ${index !== undefined && (index + 1) % 2 === 0 ? " md:mt-0 " : ""}`}
    >
      <div className="relative">
        <img
          src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
          alt=""
          className="w-full"
        />
        <div className="absolute left-1 top-1 bg-info text-white md:px-4 px-3 py-1 rounded-full md:text-sm text-[0.7rem] font-unique">
          40%
        </div>
      </div>
      <div className="mt-2 space-y-2">
        <h2 className="font-secondary md:text-lg text-[0.9rem]">
          Samsung Galaxy S20 Ultra-128GB Black
        </h2>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className=" text-info flex items-center gap-1">
              <span>
                <IoIosStar />
              </span>
              <span>
                <IoIosStar />
              </span>
              <span>
                <IoIosStar />
              </span>
              <span>
                <IoIosStar />
              </span>
              <span>
                <IoIosStarHalf />
              </span>
            </div>
            <p className="text-gray-400 text-sm">(03)</p>
          </div>
          <h2 className="font-primary font-semibold md:text-lg text-[1rem] text-primary">
            $320.00 <del className="text-black md:text-[1rem] text-sm">$360</del>
          </h2>
        </div>
        <div className="font-secondary flex items-center gap-2 md:text-sm text-[0.6rem]">
          <p className="text-green-600 font-medium">
            <span className="">
              <GoCheck className="inline md:text-xl text-sm" />
            </span>{" "}
            <span>In stock</span>
          </p>
          <p className="text-gray-700">32 Products</p>
        </div>
        <div></div>
      </div>
      <div className="absolute top-0 -right-[100%] button-group   ease-in-out duration-300  flex items-center gap-3 flex-col w-fit py-3 px-1">
        <button className="text-xl bg-primary p-2 rounded-full  text-white">
          <IoCartOutline />
        </button>
        <button className="text-xl bg-info p-2 rounded-full  text-white">
          <LuHeart />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

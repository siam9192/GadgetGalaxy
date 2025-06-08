import React from "react";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { TbHandClick } from "react-icons/tb";
import BestDealCounter from "../ui/BestDealCounter";

const BestDealProductCard = () => {
  return (
    <div className="md:p-5 p-2 border-2 rounded-lg border-primary  grid   md:grid-cols-5 grid-cols-1  gap-5  bg-white ">
      <div className="md:col-span-2">
        <img
          src="https://i5.walmartimages.com/seo/Restored-Apple-iPhone-X-Refurbished-Smartphone-256GB-Fully-Unlocked-Silver-Color-Refurbished_79e69493-85db-4c38-8406-60da206bba5b.7658f71f88486ebe02ff324f56f0bbbe.jpeg"
          alt=""
        />
      </div>
      <div className="md:col-span-3">
        <div className="mt-2 space-y-2">
          <h2 className="font-secondary md:text-xl  font-medium text-[0.9rem]">
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
            <h2 className="font-primary font-semibold text-lg text-primary">
              $320.00 <del className="text-black text-[1rem]">$360</del>
            </h2>
          </div>
          <div className="font-secondary flex items-center gap-2 md:text-sm text-[0.6rem]"></div>
          <div></div>
        </div>
        <BestDealCounter />

        <div className="mt-4 flex items-center md:justify-start justify-end gap-2">
          {1 ? (
            <button className=" py-3 px-4 bg-primary uppercase text-white hover:bg-secondary hover:text-black rounded-md flex items-center gap-2">
              <span className="text-2xl text-white">
                <IoCartOutline />
              </span>
              <span>Add to cart</span>
            </button>
          ) : (
            <button className=" py-3 px-4 bg-info uppercase text-white hover:bg-secondary hover:text-black rounded-md flex items-center gap-2">
              <span className="text-2xl text-white">
                <TbHandClick />
              </span>
              <span>chose options</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestDealProductCard;

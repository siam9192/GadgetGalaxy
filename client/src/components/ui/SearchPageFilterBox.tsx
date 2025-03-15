"use client";
import React from "react";
import RangeSlider from "../range-slider/RangeSlider";

const SearchPageFilterBox = () => {
  return (
    <div className="h-fit  w-full bg-blue-100 p-5">
      <div className="mt-5 space-y-4">
        <div className="bg-white p-4">
          <h6 className="uppercase">Filter By Price</h6>
          <div className="mt-5">
            <RangeSlider />
          </div>
        </div>
        <div className="bg-white p-4">
          <h6 className="uppercase font-medium">Brands</h6>
          <div className="mt-5 max-h-[400px] overflow-y-auto">
            {Array.from({
              length: 10,
            }).map((_, index) => (
              <div key={index} className="py-2 flex items-center gap-2">
                <img
                  src="https://gadgetz.com.bd/wp-content/uploads/2022/01/Havit-logo.png"
                  alt=""
                  className="w-1/5"
                />
                <p className="text-lg text-gray-800 opacity-60">Havit</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4">
          <h6 className="uppercase font-medium">Categories</h6>
          <div className="mt-5 max-h-[400px] overflow-y-auto">
            {Array.from({
              length: 10,
            }).map((_, index) => (
              <div key={index} className="py-2 flex items-center gap-2">
                <img
                  src="https://static-00.iconduck.com/assets.00/camera-icon-2048x1821-0b66mmq3.png"
                  alt=""
                  className="size-8 scale-90
                       "
                />
                <h6 className="text-sm opacity-60">Compute and Accessorious</h6>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button className="w-full py-3 bg-primary text-white ">Filter</button>
      </div>
    </div>
  );
};

export default SearchPageFilterBox;

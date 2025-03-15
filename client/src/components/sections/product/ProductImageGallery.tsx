"use client";
import React from "react";

const ProductImageGallery = () => {
  const images = [];
  return (
    <div className="bg-white p-5 flex flex-col">
      <div className=" grow">
        <img
          src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
          alt=""
          className="md:max-w-[60%] mx-auto"
        />
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-5  grid-cols-4 gap-2 ">
        {Array.from({ length: 5 }).map((image, index) => (
          <div
            key={index}
            className=" p-2 border-2 border-gray-900/10 hover:border-info hover:cursor-pointer  rounded-md"
          >
            <img
              src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
              alt=""
            />
          </div>
        ))}
        <div className="p-2  border-2 border-gray-900/10 rounded-md flex items-center text-center justify-center flex-col">
          <p className="font-medium text-sm">+4 More</p>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;

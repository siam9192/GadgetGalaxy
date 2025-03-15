"use client";
import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import "@/styles/util.css";
import ProductImageGallery from "../sections/product/ProductImageGallery";
import ProductBasicInfo from "../sections/product/ProductBasicInfo";
export const ProductQuickView = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xl bg-black p-2 rounded-full  text-white"
      >
        <LuSearch />
      </button>
      {isOpen ? (
        <div
          onClick={() => setIsOpen(false)}
          className="bg-gray-900/40 fixed inset-0  flex flex-col items-center justify-center z-50  "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className=" lg:w-1/2 md:w-10/12 overflow-y-auto md:h-[80vh] w-full h-full    bg-white md:rounded-lg md:min-h-60 "
          >
            <div className="mt-5 grid   grid-cols-1 gap-5">
              <ProductImageGallery />
              <ProductBasicInfo />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-1  right-2 p-2 bg-red-100  rounded-full md:hidden block text-xl "
            >
              <RxCross1 />
            </button>
          </div>
        </div>
      ) : (
        false
      )}
    </>
  );
};

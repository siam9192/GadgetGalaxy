"use client";
import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import "@/styles/util.css";
import { ProductQuickView } from "./ProductQuickView";
import { RxCross1 } from "react-icons/rx";

interface IProps {
  slug: string;
}

const ProductQuickViewPopup = ({ slug }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle; // Clean up on unmount or isOpen change
      };
    } else {
      document.body.style.overflow = "";
    }
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
            <ProductQuickView slug={slug} />

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-1  right-2 p-2 bg-red-100  rounded-full md:hidden block text-xl "
            >
              <RxCross1 />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductQuickViewPopup;

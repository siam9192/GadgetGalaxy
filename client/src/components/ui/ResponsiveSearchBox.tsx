"use client";
import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { TbCurrencyTaka } from "react-icons/tb";
import ProductRating from "./ProductRating";
import { RxCross2 } from "react-icons/rx";
import "@/styles/util.css";
const ResponsiveSearchBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const results = Array.from({ length: 20 }, (_, i) => ({
    type: i % 2 === 0 ? "product" : "category",
    name: `Item ${i + 1}`,
    imageUrl: `https://example.com/image${i + 1}.jpg`,
    price: i % 2 === 0 ? (Math.random() * 100).toFixed(2) : undefined,
    stock: Math.floor(Math.random() * 10) + 1,
    hierarchySte: i % 2 !== 0 ? `Category ${Math.ceil((i + 1) / 2)}` : undefined,
  }));

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-3xl text-black relative  lg:hidden block"
      >
        <LuSearch />
      </button>
      {isOpen ? (
        <div className="fixed inset-0 bg-white h-full z-50 p-2 responsive-searchbox ">
          <input
            type="text"
            placeholder="Enter search keyword.."
            className="w-full  bg-gray-100 px-2  py-3"
          />

          <div className="h-screen overflow-y-auto pb-5">
            {results.map((item, index) => {
              if (item.type === "product") {
                return (
                  <div key={index} className="p-2 hover:bg-gray-100 ">
                    <p className="text-primary font-medium text-sm mb-1">Product</p>
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          "https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
                        }
                        alt=""
                        className="size-16"
                      />
                      <div>
                        <h5 className="text-lg ">{item.name}</h5>
                        <h3 className="text-primary font-semibold flex items-center ">
                          <span className="text-xl">
                            <TbCurrencyTaka />
                          </span>
                          <span>{item.price}</span>
                        </h3>
                        <ProductRating />
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="p-3 hover:bg-gray-100">
                    <p className="text-info font-medium text-sm mb-1">Category</p>
                    <div className=" flex gap-2 ">
                      <img
                        src={"https://gadgetz.com.bd/wp-content/uploads/2024/04/10000mAh.png"}
                        alt=""
                        className="size-16"
                      />
                      <div>
                        <h5 className="text-lg">{item.name}</h5>
                        <h6 className="text-gray-800 text-sm">{item.hierarchySte}</h6>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 bg-info text-white text-2xl fixed right-4 bottom-10 rounded-full"
          >
            <RxCross2 />
          </button>
        </div>
      ) : null}
    </>
  );
};

export default ResponsiveSearchBox;

"use client";
import React, { useState } from "react";
import ProductRating from "./ProductRating";
import { TbCurrencyTaka } from "react-icons/tb";

const SearchBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const results = Array.from({ length: 20 }, (_, i) => ({
    type: i % 2 === 0 ? "product" : "category",
    name: `Item ${i + 1}`,
    imageUrl: `https://example.com/image${i + 1}.jpg`,
    price: i % 2 === 0 ? (Math.random() * 100).toFixed(2) : undefined,
    stock: Math.floor(Math.random() * 10) + 1,
    hierarchySte: i % 2 !== 0 ? `Category ${Math.ceil((i + 1) / 2)}` : undefined,
  }));

  return (
    <div className="relative">
      <div className="pl-3  border-1 border-r-0 border-gray-700/15 rounded-lg w-full  relative gap-2 py-3">
        <input
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          type="text"
          placeholder="Search for products..."
          className=" bg-transparent outline-none w-full px-2  placeholder:text-gray-700  placeholder:text-lg rounded-full  "
        />
        <button className=" px-6  h-full absolute top-0 right-0 border-2 rounded-r-lg border-primary bg-primary  text-white  ">
          Search
        </button>
      </div>
      {isOpen ? (
        <div className="absolute left-0 top-14 p-2 w-full bg-white rounded-lg min-h-52 max-h-[600px] overflow-y-auto z-50  shadow-xl no-scrollbar">
          <div>
            {results.map((item, index) => {
              if (item.type === "product") {
                return (
                  <div key={index} className="p-2 hover:bg-gray-100">
                    <p className="text-primary font-medium text-sm mb-1">Product</p>
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          "https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
                        }
                        alt=""
                        className="size-12"
                      />
                      <div>
                        <h5 className=" text-lg ">{item.name}</h5>
                        <ProductRating />
                        <h3 className="text-primary font-semibold flex items-center ">
                          <span className="text-xl">
                            <TbCurrencyTaka />
                          </span>
                          <span>{item.price}</span>
                        </h3>
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
                        className="size-12"
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
        </div>
      ) : null}
    </div>
  );
};

export default SearchBox;

"use client";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import ProductRating from "./ProductRating";
import { TbCurrencyTaka } from "react-icons/tb";
import { useGetSearchKeywordResultsQuery } from "@/redux/features/utils/utils.api";
import { useRouter } from "next/navigation";
import { defaultImagesUrl } from "@/utils/constant";
import Link from "next/link";

const SearchBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [keyword, setKeyword] = useState("");

  const { data, isLoading, isFetching } = useGetSearchKeywordResultsQuery(keyword);

  const results = data?.data || [];

  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const current = ref.current;
      if (!current) return;
      const target = event.target as Node;

      if (isOpen && !current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [isOpen]);

  const handelKeywordSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    setIsOpen(true);
    if (e.key.toLowerCase() !== "enter") return;
    router.push(`/search?searchTerm=${keyword}`);
  };

  return (
    <div className="relative">
      <div className="pl-3  border-1 border-r-0 border-gray-700/15 rounded-lg w-full  relative gap-2 py-3">
        <input
          onFocus={() => setIsOpen(true)}
          type="text"
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handelKeywordSearch}
          placeholder="Search for products..."
          className=" bg-transparent outline-none w-full px-2  placeholder:text-gray-700  placeholder:text-lg rounded-full  "
        />
        <button
          onClick={() => router.push(`/search?searchTerm=${keyword}`)}
          className=" px-6  h-full absolute top-0 right-0 border-2 rounded-r-lg border-primary bg-primary  text-white  "
        >
          Search
        </button>
      </div>
      {isOpen ? (
        <div
          ref={ref}
          className="absolute left-0 top-14 p-2 w-full bg-white rounded-lg min-h-52 max-h-[600px] overflow-y-auto z-50  shadow-xl no-scrollbar"
        >
          <div>
            {isLoading || isFetching ? (
              <p>Loading...</p>
            ) : (
              results.map((item, index) => {
                if (item.type === "product") {
                  return (
                    <Link key={index} href={`/products/${item.slug}`}>
                      <div className="p-2 hover:bg-gray-100">
                        <p className="text-primary font-medium text-sm mb-1">Product</p>
                        <div className="flex items-center gap-2">
                          <img src={item.imageUrl} alt="" className="size-12" />
                          <div>
                            <h5 className=" text-lg ">{item.name}</h5>
                            <ProductRating rating={item.rating || 0} />
                            <div className="text-primary font-semibold flex items-center gap-2 ">
                              <div className="flex items-center">
                                <span className="text-xl">
                                  <TbCurrencyTaka />
                                </span>
                                <span>{item.offerPrice || item.price}</span>
                              </div>
                              {item.offerPrice ? (
                                <div className="flex items-center text-gray-800">
                                  <span>
                                    {" "}
                                    <TbCurrencyTaka />
                                  </span>{" "}
                                  <del> {item.price}</del>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <Link key={index} href={`/product-category/${item.slug}`}>
                      <div className="p-3 hover:bg-gray-100">
                        <p className="text-info font-medium text-sm mb-1">Category</p>
                        <div className=" flex gap-2 ">
                          <img
                            src={item.imageUrl || defaultImagesUrl.category}
                            alt=""
                            className="size-12"
                          />
                          <div>
                            <h5 className="text-lg">{item.name}</h5>
                            <h6 className="text-gray-800 text-sm">{item.hierarchySte}</h6>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBox;

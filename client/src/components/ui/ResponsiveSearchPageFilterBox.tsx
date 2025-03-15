"use client";
import React, { useState } from "react";
import { CiFilter } from "react-icons/ci";
import SearchPageFilterBox from "./SearchPageFilterBox";

const ResponsiveSearchPageFilterBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-3xl p-2">
        <CiFilter />
      </button>
      {isOpen ? (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-gray-900/50 z-50 transition-all duration-500   "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-10/12 overflow-y-auto h-full no-scrollbar"
          >
            <SearchPageFilterBox />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ResponsiveSearchPageFilterBox;

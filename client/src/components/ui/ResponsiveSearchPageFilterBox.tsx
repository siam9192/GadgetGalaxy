"use client";
import React, { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import SearchPageFilterBox from "./SearchPageFilterBox";
import { useSearchParams } from "next/navigation";

const ResponsiveSearchPageFilterBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);
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

"use client";
import { urlSearch } from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";

const ProductViewTypeButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewType = searchParams.get("viewType");
  const onChange = (type: "grid" | "list") => {
    router.push(`${urlSearch(searchParams, [{ name: "viewType", value: type }])}`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange("grid")}
        className={`text-3xl p-2 ${viewType !== "list" ? "text-info" : ""} active:opacity-35 transition-opacity duration-75`}
      >
        <BsFillGrid3X3GapFill />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`text-3xl p-2 ${viewType == "list" ? "text-info" : ""} active:opacity-35 transition-opacity duration-75`}
      >
        <FaList />
      </button>
    </div>
  );
};

export default ProductViewTypeButton;

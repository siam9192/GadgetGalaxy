"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { LuMoveLeft } from "react-icons/lu";

const NavigateTab = () => {
  const router = useRouter();
  return (
    <div className="p-5 bg-white">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="text-2xl p-2 bg-gray-50">
          <LuMoveLeft />
        </button>
        <p className="  opacity-60 font-medium">Home/Products/Product-1</p>
      </div>
    </div>
  );
};

export default NavigateTab;

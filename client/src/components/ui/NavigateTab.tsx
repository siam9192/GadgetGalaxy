"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { LuMoveLeft } from "react-icons/lu";

const NavigateTab = () => {
  const router = useRouter();
  const {slug} = useParams()
  return (
    <div className="p-5 bg-white">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="text-2xl p-2 bg-gray-50">
          <LuMoveLeft />
        </button>
        <p className=" text-gray-700 font-medium"><Link href='/'>Home</Link><Link href='/search'>/Products</Link><span className=" text-black opacity-100 font-semibold">/{slug}</span></p>
      </div>
    </div>
  );
};

export default NavigateTab;

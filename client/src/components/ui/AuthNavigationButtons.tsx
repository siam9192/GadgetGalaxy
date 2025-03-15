"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { GoHome } from "react-icons/go";
import { MdArrowBack } from "react-icons/md";

const AuthNavigationButtons = () => {
  const router = useRouter();
  return (
    <div className="absolute top-2  right-2 flex items-center gap-2">
      <button onClick={() => router.back()} className="text-3xl p-2 bg-gray-100 rounded-full ">
        <MdArrowBack />
      </button>

      <Link href={"/"}>
        <button className="text-3xl p-2 bg-gray-100 rounded-full active:opacity-10 ">
          <GoHome />
        </button>
      </Link>
    </div>
  );
};

export default AuthNavigationButtons;

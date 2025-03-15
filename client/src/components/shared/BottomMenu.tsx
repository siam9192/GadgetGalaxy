"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BsCart2 } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";
import { TbCategory } from "react-icons/tb";

const BottomMenu = () => {
  const pathname = usePathname();
  return (
    <section className="fixed bottom-0 left-0 right-0 p-1 md:hidden    ">
      <div className="rounded-lg bg-black w-full py-3 px-2  flex items-center justify-between">
        <Link href={"/"}>
          <div className="flex flex-col justify-center items-center">
            <button
              className={`text-xl p-2 ${pathname === "/" ? "bg-primary text-white" : "bg-gray-100 text-black"}  rounded-full `}
            >
              <IoHomeOutline />
            </button>
            <p className="text-white text-[0.7rem] text-center">Home</p>
          </div>
        </Link>
        <Link href={"/product-categories"}>
          <div className="flex flex-col justify-center items-center">
            <button
              className={`text-xl p-2 ${pathname === "/product-categories" ? "bg-primary text-white" : "bg-gray-100 text-black"}  rounded-full `}
            >
              <TbCategory />
            </button>
            <p className="text-white text-[0.7rem] text-center">Categories</p>
          </div>
        </Link>

        <Link href={"/wishlist"}>
          <div className="flex flex-col justify-center items-center relative">
            <button
              className={`text-xl p-2 ${pathname === "/wishlist" ? "bg-primary text-white" : "bg-gray-100 text-black"}  rounded-full `}
            >
              <GoHeart />
              <div className="size-5 bg-info text-[0.7rem] text-white flex justify-center flex-col items-center text-center rounded-full absolute -top-3 -right-2">
                <span>5</span>
              </div>
            </button>
            <p className="text-white text-[0.7rem] text-center">Wish</p>
          </div>
        </Link>
        <Link href="/cart">
          <div className="flex flex-col justify-center items-center relative">
            <button
              className={`text-xl p-2 ${pathname === "/cart" ? "bg-primary text-white" : "bg-gray-100 text-black"}  rounded-full `}
            >
              <BsCart2 />
              <div className="size-5 bg-info text-[0.7rem] text-white flex justify-center flex-col items-center text-center rounded-full absolute -top-3 -right-2">
                <span>5</span>
              </div>
            </button>
            <p className="text-white text-[0.7rem] text-center">Cart</p>
          </div>
        </Link>

        <div>
          <div className="p-2 bg-white rounded-full">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3001/3001758.png"
              alt=""
              className="size-5 rounded-full"
            />
          </div>
          <p className="text-white text-[0.7rem] text-center">Profile</p>
        </div>
      </div>
    </section>
  );
};

export default BottomMenu;

"use client";
import { useGetMyCountQuery } from "@/redux/features/utils/utils.api";
import Link from "next/link";
import React from "react";
import { BsCart2 } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import NotificationBar from "./NotificationBar";

const HeaderUtils = () => {
  const { data } = useGetMyCountQuery(undefined);
  const count = data?.data;

  return (
    <>
      <Link href="/wishlist">
        <button className="text-3xl text-black relative md:block hidden">
          <GoHeart />
          {count?.wishListItem ? (
            <div className="size-5 bg-info text-[0.7rem] text-white flex justify-center flex-col items-center text-center rounded-full absolute -top-3 -right-2">
              <span>{count?.wishListItem || 0}</span>
            </div>
          ) : null}
        </button>
      </Link>
      <Link href="/cart">
        <button className="text-3xl text-black relative md:block hidden">
          <BsCart2 />
          {count?.cartItem ? (
            <div className="size-5 bg-info text-[0.7rem] text-white flex justify-center flex-col items-center text-center rounded-full absolute -top-3 -right-2">
              <span>{count?.cartItem || 0}</span>
            </div>
          ) : null}
        </button>
      </Link>
      <NotificationBar />
    </>
  );
};

export default HeaderUtils;

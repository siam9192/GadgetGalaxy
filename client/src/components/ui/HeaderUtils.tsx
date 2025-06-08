"use client";
import { useGetMyCountQuery } from "@/redux/features/utils/utils.api";
import Link from "next/link";
import React from "react";
import { BsCart2 } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import NotificationBar from "./NotificationBar";
import { useCurrentUser } from "@/provider/CurrentUserProvider";
import ResponsiveSearchBox from "./ResponsiveSearchBox";

const HeaderUtils = () => {
  const { user } = useCurrentUser();
  const { data } = useGetMyCountQuery(undefined);
  const count = data?.data;

  return (
    <>
    <ResponsiveSearchBox />

      <Link href="/wishlist" className="md:block hidden">
        <button className="text-3xl text-black relative md:block hidden p-1">
          <GoHeart />
          {count?.wishListItem ? (
            <div className="size-5 bg-info text-[0.7rem] text-white flex justify-center flex-col items-center text-center rounded-full absolute -top-3 -right-2">
              <span>{count?.wishListItem || 0}</span>
            </div>
          ) : null}
        </button>
      </Link>
      <Link href="/cart" className="md:block hidden">
        <button className="text-3xl text-black relative p-1">
          <BsCart2 />
          {count?.cartItem ? (
            <div className="size-5 bg-info text-[0.7rem] text-white flex justify-center flex-col items-center text-center rounded-full absolute -top-3 -right-2">
              <span>{count?.cartItem || 0}</span>
            </div>
          ) : null}
        </button>
      </Link>
      {user ? <NotificationBar /> : null}
    </>
  );
};

export default HeaderUtils;

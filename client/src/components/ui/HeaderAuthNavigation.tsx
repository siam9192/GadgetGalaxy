"use client";
import { useCurrentUser } from "@/provider/CurrentUserProvider";
import { defaultImagesUrl } from "@/utils/constant";
import Link from "next/link";
import React from "react";
import { AiOutlineUser } from "react-icons/ai";

const HeaderAuthNavigation = () => {
  const { user } = useCurrentUser();
  return !user ? (
    <Link href={"/login"} className="lg:block hidden">
      <button className="flex items-center gap-1">
        <span className="text-3xl">
          <AiOutlineUser />
        </span>
      </button>
    </Link>
  ) : (
    <Link href={"/account"} className="lg:block hidden">
      <img
        className="size-10 outline-2 outline-primary  outline-offset-4 rounded-full"
        src={user.profilePhoto||defaultImagesUrl.profileMain}
        alt=""
      />
    </Link>
  );
};

export default HeaderAuthNavigation;

"use client";
import { useCurrentUser } from "@/provider/CurrentUserProvider";
import { logout } from "@/services/auth.service";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { CiLogout } from "react-icons/ci";
import { FaCommentDots } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { LiaTruckMovingSolid } from "react-icons/lia";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdComment } from "react-icons/md";

const routes = [
  {
    name: "Overview",
    icon: LuLayoutDashboard,
    path: "/account",
  },

  {
    name: "Order History",
    icon: LiaTruckMovingSolid,
    path: "/account/order-history",
  },
  {
    name: "Yet to Review",
    icon: FaCommentDots,
    path: "/account/yet-to-review",
  },
  {
    name: "My Reviews",
    icon: MdComment,
    path: "/account/my-reviews",
  },
  {
    name: "Setting",
    icon: IoSettingsOutline,
    path: "/account/setting",
  },
];

const AccountSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { refetch,setUser} = useCurrentUser();
  const handelLogout = async () => {
    const st = await logout();
    if (st) {
      setUser(null)
      refetch();
      router.replace("/");
    }
  };
  return (
    <div className="h-fit bg-white py-5 space-y-5">
      {routes.map((route, index) => (
        <button
          key={index}
          onClick={() => router.push(route.path)}
          className={`w-full flex items-center gap-4 px-3 py-2  relative ${pathname === route.path ? "border-l-6 border-primary rounded-l-md" : ""}  hover:text-primary`}
        >
          <span className="text-3xl">
            <route.icon />
          </span>
          <span className="text-xl  ">{route.name}</span>
        </button>
      ))}
      <button
        onClick={() => handelLogout()}
        className={`w-full flex items-center gap-4 px-3 py-2  relative `}
      >
        <span className="text-3xl">
          <CiLogout />
        </span>
        <span className="text-xl text-red-500 ">Logout</span>
      </button>
    </div>
  );
};

export default AccountSidebar;

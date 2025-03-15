"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { CiLock } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
const routes = [
  {
    name: "Profile Setting",
    path: "/account/setting",
    icon: FaUser,
  },
  {
    name: "Password",
    path: "/account/setting/manage-password",
    icon: CiLock,
  },
  {
    name: "Notifications",
    path: "/account/setting/notifications",
    icon: IoNotificationsOutline,
  },
];

const SettingSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="py-8 rounded-md bg-white">
      {routes.map((route, index) => (
        <button
          key={index}
          onClick={() => router.push(route.path)}
          className={`w-full flex items-center gap-4 px-3  py-4  relative ${pathname === route.path ? "border-r-6 border-primary rounded-r-lg bg-primary/15 text-primary" : ""}  hover:text-primary`}
        >
          <span className="text-3xl">
            <route.icon />
          </span>
          <span className="text-xl  ">{route.name}</span>
        </button>
      ))}
    </div>
  );
};

export default SettingSidebar;

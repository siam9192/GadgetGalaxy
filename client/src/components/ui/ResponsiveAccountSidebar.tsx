"use client";
import React, { useEffect, useState } from "react";
import { RiMenuFill } from "react-icons/ri";
import "@/styles/util.css";
import { usePathname } from "next/navigation";
import ResponsiveNavbar from "./ResponsiveNavbar";
import ResponsiveBrowseCategories from "./ResponsiveBrowseCategories";
import AccountSidebar from "./AccountSidebar";

const ResponsiveAccountSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(1);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-2xl my-3 p-2 bg-white active:opacity-40 text-black md:hidden  block  "
      >
        <RiMenuFill />
      </button>

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed  ${!isOpen ? "-left-[100%]" : "right-0"} h-full w-full top-0 bg-gray-900/20 z-50  duration-200`}
      >
        <div onClick={(e) => e.stopPropagation()} className={`w-[80%]   h-full p-2 bg-white`}>
          <AccountSidebar />
        </div>
      </div>
    </>
  );
};

export default ResponsiveAccountSidebar;

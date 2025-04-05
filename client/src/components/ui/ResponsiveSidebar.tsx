"use client";
import React, { useEffect, useState } from "react";
import { RiMenuFill } from "react-icons/ri";
import "@/styles/util.css";
import { usePathname } from "next/navigation";
import ResponsiveNavbar from "./ResponsiveNavbar";
import ResponsiveBrowseCategories from "./ResponsiveBrowseCategories";

const ResponsiveSidebar = () => {
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
        className="text-2xl p-2 bg-primary active:opacity-40 text-white md:hidden  block  "
      >
        <RiMenuFill />
      </button>

      <div
        onClick={() => setIsOpen(false)}
        className={`fixed  ${!isOpen ? "-left-[100%]" : "left-0"} h-full w-full top-0 bg-gray-900/20 z-50  duration-200`}
      >
        <div onClick={(e) => e.stopPropagation()} className={`w-[80%]   h-full p-2 bg-white`}>
          <div
            className={`flex gap-2 font-medium  after:content-[''] after:h-full after:w-1/2 after:bg-primary after:absolute after:top-0 after:left-0  relative ${active === 1 ? "after:translate-x-[0%]" : "after:translate-x-[100%]"} after:duration-500`}
          >
            <button
              onClick={() => setActive(1)}
              className="w-1/2 py-3 font-secondary bg-transparent relative flex items-center justify-center"
            >
              <div className={`${active === 1 ? "text-white" : "text-black"} z-[50]`}>Menu</div>
              <input
                type="radio"
                id="tab-menu"
                className="hidden"
                onChange={() => {}}
                checked={active === 1}
              />
            </button>
            <button
              onClick={() => setActive(2)}
              className="w-1/2 py-3 font-secondary bg-transparent relative flex items-center justify-center"
            >
              <div className={`${active === 2 ? "text-white" : "text-black"} z-[50]`}>
                Categories
              </div>
              <input
                type="radio"
                id="tab-categories"
                className="hidden"
                onChange={() => {}}
                checked={active === 1}
              />
            </button>
          </div>
          {active === 1 ? <ResponsiveNavbar /> : <ResponsiveBrowseCategories />}
        </div>
      </div>
    </>
  );
};

export default ResponsiveSidebar;

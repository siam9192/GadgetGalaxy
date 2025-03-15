"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { FcAbout } from "react-icons/fc";
import { ImBlogger } from "react-icons/im";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineContactSupport } from "react-icons/md";
import { RiMenuFill } from "react-icons/ri";
import "@/styles/util.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
const navLinks = [
  {
    name: "Home",
    href: "/",
    icon: IoHomeOutline,
  },
  {
    name: "Products",
    href: "/search",
    icon: AiOutlineProduct,
  },
  {
    name: "Blogs",
    href: "/blogs",
    icon: ImBlogger,
  },
  {
    name: "About Us",
    href: "/about-us",
    icon: FcAbout,
  },
  {
    name: "Contact Us",
    href: "/contact-us",
    icon: MdOutlineContactSupport,
  },
];
const ResponsiveNavbar = () => {
  return (
    <div className="mt-5">
            {navLinks.map((item) => (
              <Link href={item.href} key={item.href}>
                <button key={item.href} className=" flex items-center gap-2 py-3 px-2 ">
                  <span className="text-2xl p-2 bg-gray-50 ">
                    <item.icon />
                  </span>
                  <span className="font-medium text-xl">{item.name}</span>
                </button>
              </Link>
            ))}
          </div>
  )
}

export default ResponsiveNavbar
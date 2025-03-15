import React from "react";
import Container from "../container/Container";
import { BsCart2, BsSearch } from "react-icons/bs";
import { LuSearch, LuShoppingBag, LuUserRound } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineUser } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import { RiMenuFill } from "react-icons/ri";
import BrowseCategories from "../ui/BrowseCategories";
import SearchBox from "../ui/SearchBox";
import ResponsiveSearchBox from "../ui/ResponsiveSearchBox";
import ResponsiveSidebar from "../ui/ResponsiveSidebar";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Products",
    href: "/search",
  },
  {
    name: "Blogs",
    href: "/",
  },
  {
    name: "About Us",
    href: "/about-us",
  },
  {
    name: "Contact Us",
    href: "/contact-us",
  },
];

const Header1 = () => {
  return (
    <header>
      <div className="md:py-2 py-2 bg-secondary text-sm">
        <Container>
          <p className="text-black md:text-sm text-[0.7rem] from-primary">
            Welcome to GadgetGalaxy
          </p>
        </Container>
      </div>
      <div className=" lg:py-5 py-2  border border-gray-600/10 bg-white">
        <Container>
          <div className="lg:grid lg:flex-none  flex justify-between items-center grid-cols-10 lg:gap-14 md:gap-5">
            <div className="col-span-2 flex flex-col">
              <img
                src="https://gadgetz.com.bd/wp-content/uploads/2023/11/gadgetz.png"
                alt=""
                className=" lg:w-full  w-[70%]"
              />
            </div>
            <div className=" col-span-6   w-full  lg:block hidden">
              <SearchBox />
            </div>
            <div className="col-span-2 bg-white px-2 py-3 flex items-center justify-end lg:gap-4 gap-3 font-primary">
              <Link href={"/login"}>
                <button className="flex items-center gap-1">
                  <span className="text-3xl">
                    <AiOutlineUser />
                  </span>
                </button>
              </Link>
              <ResponsiveSearchBox />
              <Link href="/wishlist">
                <button className="text-3xl text-black relative md:block hidden">
                  <GoHeart />
                  <div className="size-5 bg-info text-[0.7rem] text-white flex justify-center flex-col items-center text-center rounded-full absolute -top-3 -right-2">
                    <span>5</span>
                  </div>
                </button>
              </Link>
              <Link href="/cart">
                <button className="text-3xl text-black relative md:block hidden">
                  <BsCart2 />
                  <div className="size-5 bg-info text-[0.7rem] text-white flex justify-center flex-col items-center text-center rounded-full absolute -top-3 -right-2">
                    <span>5</span>
                  </div>
                </button>
              </Link>
              <ResponsiveSidebar />
            </div>
          </div>
        </Container>
      </div>
      <div className="py-2 border-b border-gray-600/10 lg:block hidden bg-white">
        <Container>
          <div className="grid grid-cols-10  items-center gap-14 font-primary ">
            <div className=" col-span-2   ">
              <BrowseCategories />
            </div>
            <div className="col-span-6 ">
              <div className="flex items-center gap-4">
                {navLinks.map((link) => (
                  <Link
                    href={link.href}
                    key={link.name}
                    className={` uppercase font-secondary text-black font-medium tracking-[0.1rem] hover:text-primary  hover:scale-95`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className=" col-span-2 px-2 py-3   font-medium flex items-center gap-2 ">
              <span className="text-2xl text-white">
                <LuUserRound />
              </span>
              <span className="text-white text-sm">Login/Register</span>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header1;

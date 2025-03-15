import React from "react";
import Container from "../container/Container";
import { BsSearch } from "react-icons/bs";
import { LuShoppingBag, LuUserRound } from "react-icons/lu";
import { IoMenu } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Campaigns",
    href: "/campaigns",
  },
  {
    name: "News",
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

const Header = () => {
  return (
    <header>
      <div className="py-2 bg-white text-sm">
        <Container>
          <p>Welcome to GadgetGalaxy</p>
        </Container>
      </div>
      <div className="py-5 bg-secondary">
        <Container>
          <div className="grid grid-cols-10 gap-14">
            <div className="col-span-2 flex flex-col">
              <h1 className="text-2xl font-medium font-unique text-white">
                Gadget<span className="text-primary">Galaxy</span>
              </h1>
              <p className="text-gray-300 text-sm font-primary">Always with you</p>
            </div>
            <div className=" col-span-6 flex items-center gap-2 bg-white w-full pl-3 h-12  font-primary font-medium">
              <input
                type="text"
                placeholder="Enter search keyword"
                className=" bg-transparent outline-none w-full p-2 placeholder:font-primary placeholder:font-medium placeholder:text-gray-800 placeholder:text-lg "
              />
              <button className=" h-full px-5 bg-primary text-gray-900 text-xl">
                <BsSearch />
              </button>
            </div>
            <div className="col-span-2 bg-white px-2 py-3 flex items-center justify-between font-primary">
              <span className="text-xl">
                <LuShoppingBag />
              </span>

              <div className="flex items-center gap-2">
                <p className="size-7  bg-info rounded-full text-white flex justify-center items-center">
                  2
                </p>
                <span className="font-medium">My Cart</span>
                <span className="text-info text-xl font-bold">$100</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-10  items-center gap-14 font-primary mt-5">
            <div className=" col-span-2 px-2 py-3  bg-primary text-secondary flex items-center justify-between font-medium">
              <p className="text-secondary text-sm">All Categories</p>
              <span className="text-xl">
                <IoMenu />
              </span>
            </div>
            <div className="col-span-6 ">
              <div className="flex items-center gap-4">
                {navLinks.map((link) => (
                  <Link
                    href={link.href}
                    key={link.name}
                    className={`text-white uppercase  tracking-[0.1rem] hover:text-primary hover:scale-95`}
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

export default Header;

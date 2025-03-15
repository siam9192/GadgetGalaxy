import SignupForm from "@/components/forms/SignupForm";
import AuthNavigationButtons from "@/components/ui/AuthNavigationButtons";
import Link from "next/link";
import React from "react";
import { GoHome } from "react-icons/go";
import { MdArrowBack } from "react-icons/md";

const page = () => {
  return (
    <div className="lg:grid grid-cols-2 h-screen overflow-y-auto">
      <div className="relative lg:block hidden">
        <img
          src="https://img.freepik.com/free-vector/antigravity-technology-with-elements_23-2148096985.jpg"
          alt=""
          className="h-full rounded-r-[60px] "
        />
        <div className="absolute top-1/4 w-full ">
          <div className="  p-10 w-1/2 mx-auto  bg-gray-900/60 backdrop-blur-sm rounded-lg space-y-3 shadow">
            <div className="text-xl uppercase text-white px-5 py-10 bg-gray-900/60 backdrop-blur-sm w-fit rounded-lg border-2 border-white">
              <h1>Tech Network</h1>
            </div>
            <h1 className="text-4xl font-primary font-semibold text-white">Explore The Universe</h1>
            <p className="text-sm text-gray-100">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, cupiditate!
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white  h-full flex flex-col justify-center items-center  relative  ">
        <div className=" md:w-[70%] w-full   p-5">
          <SignupForm />
        </div>
        <AuthNavigationButtons />
      </div>
    </div>
  );
};

export default page;

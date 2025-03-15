import Container from "@/components/container/Container";
import React from "react";
import { BiSupport } from "react-icons/bi";
import { GiTakeMyMoney } from "react-icons/gi";
import { GoGift } from "react-icons/go";
import { HiOutlineTruck } from "react-icons/hi";

const OurServices = () => {
  return (
    <section className="md:py-10 py-6">
      <Container>
        <div className="bg-white  shadow-xl px-5 lg:py-20 py-10  grid  lg:grid-cols-4 grid-cols-2 md:gap-10 gap-5">
          <div className="flex md:flex-row flex-col items-center gap-2">
            <span className=" md:text-7xl text-5xl text-primary ">
              <HiOutlineTruck />
            </span>
            <div>
              <h6 className="font-medium text-black font-primary">Worldwide Shipping</h6>
              <p className="text-gray-600 text-sm">Order upto 100</p>
            </div>
          </div>
          <div className="flex md:flex-row flex-col items-center gap-2">
            <span className="md:text-7xl text-5xl text-primary ">
              <GoGift />
            </span>
            <div>
              <h6 className="font-medium text-black font-primary">Worldwide Shipping</h6>
              <p className="text-gray-600 text-sm">Order upto 100</p>
            </div>
          </div>
          <div className="flex md:flex-row flex-col items-center gap-2">
            <span className="md:text-7xl text-5xl text-primary ">
              <GiTakeMyMoney />
            </span>
            <div>
              <h6 className="font-medium text-black font-primary">Worldwide Shipping</h6>
              <p className="text-gray-600 text-sm">Order upto 100</p>
            </div>
          </div>
          <div className="flex md:flex-row flex-col items-center gap-2">
            <span className="md:text-7xl text-5xl text-primary ">
              <BiSupport />
            </span>
            <div>
              <h6 className="font-medium text-black font-primary">Worldwide Shipping</h6>
              <p className="text-gray-600 text-sm">Order upto 100</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OurServices;

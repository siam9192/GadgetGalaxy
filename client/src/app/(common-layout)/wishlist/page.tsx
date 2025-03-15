import ProductCard from "@/components/cards/ProductCard";
import WishCard from "@/components/cards/WishCard";
import React from "react";

const page = () => {
  return (
    <div className="md:py-8 py-6 min-h-screen">
      <div className="p-5 bg-white flex justify-between items-center">
        <h1 className="lg:text-5xl md:text-4xl text-3xl font-primary  font-semibold">
          My <span className="text-primary">Wish List</span>
        </h1>
        <div className="size-10 bg-info flex justify-center items-center text-white font-primary font-medium rounded-full">
          30
        </div>
      </div>
      <div className="mt-5">
        <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 md:gap-3 gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <WishCard index={index} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;

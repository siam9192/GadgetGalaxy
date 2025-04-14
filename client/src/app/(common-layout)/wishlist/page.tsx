"use client";
import WishCard from "@/components/cards/WishCard";
import { useGetMyWishListQuery } from "@/redux/features/wishList/wishList.api";
import React from "react";

const page = () => {
  const { data, isLoading } = useGetMyWishListQuery([]);
  const products = data?.data || [];
  const meta = data?.meta;

  if (isLoading)
    return (
      <div className="h-screen">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="md:py-8 py-6 min-h-screen">
      <div className="p-5 bg-white flex justify-between items-center">
        <h1 className="lg:text-5xl md:text-4xl text-3xl font-primary  font-semibold">
          My <span className="text-primary">Wish List</span>
        </h1>
        <div className="size-10 bg-info flex justify-center items-center text-white font-primary font-medium rounded-full">
          {meta?.totalResult}
        </div>
      </div>
      {meta?.totalResult ? (
        <div className="mt-5">
          <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 md:gap-3 gap-2">
            {products.map((_, index) => (
              <WishCard product={_} index={index} key={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-5">
          <h1 className="text-xl text-black font-medium">No product</h1>
        </div>
      )}
    </div>
  );
};

export default page;

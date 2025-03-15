"use client";
import React, { useEffect, useState } from "react";
import Rating from "../ui/Rating";
import useScreen from "@/hooks/useScreen";

const ProductReviewCard = () => {
  const { screenType } = useScreen();
  const showLength = screenType === "lg" ? 6 : screenType === "md" ? 5 : 4;

  return (
    <div className="p-3 border-2 rounded-lg border-blue-100">
      <h6 className="font-medium">
        <span className="opacity-70 text-sm">Review by</span> Arafat Hasan Siam
      </h6>

      <div className=" mt-3 flex flex-wrap gap-3">
        {Array.from({ length: showLength }).map((_, index) => (
          <img
            key={index}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFI451_VzftMWgG1Mfn8yE61kqxY_cErrqug&s"
            alt=""
            className="object-cover size-20  aspect-square"
          />
        ))}
        <div className="size-20 flex flex-col justify-center items-center bg-gray-800  backdrop-blur-lg text-white text-sm">
          +2 more
        </div>
      </div>
      <div className="mt-3">
        <Rating />
        <p className="text-sm">
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, distinctio, odit harum
          sunt itaque reprehenderit labore, excepturi mollitia provident voluptatum optio veritatis
          assumenda corporis sit voluptatem quae nesciunt natus vero."
        </p>
        <p className="mt-2 text-end font-medium text-gray-700">{new Date().toDateString()}</p>
      </div>
    </div>
  );
};

export default ProductReviewCard;

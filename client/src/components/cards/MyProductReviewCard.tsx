"use client";
import React, { useEffect, useState } from "react";
import Rating from "../ui/Rating";
import useScreen from "@/hooks/useScreen";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdModeEdit } from "react-icons/md";

const MyProductReviewCard = () => {
  const { screenType } = useScreen();
  const showLength = screenType === "lg" ? 6 : screenType === "md" ? 5 : 4;

  return (
    <div className="mt-3 p-3 border-2 rounded-lg border-blue-100 bg-white">
      <p className="mt-2 text-end font-medium text-gray-700 ">{new Date().toDateString()}</p>
      <div className="mt-3 flex items-center  gap-2 p-2 border-2 border-gray-700/10 w-fit rounded-lg">
        <img
          src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
          alt=""
          className="size-20"
        />
        <div>
          <h1 className="text-lg font-medium">IPhone 15 pro max</h1>
          <p className="text-sm text-gray-700">128|Black|Global</p>
          <h3 className="flex items-center text-primary">
            <span className="text-2xl ">
              <TbCurrencyTaka />
            </span>
            <span className="font-medium  ">376</span>
          </h3>
        </div>
      </div>
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
      </div>

      <div className="mt-2 flex items-center justify-end gap-2">
        <button className="text-primary font-medium">Edit</button>
        <button className="text-red-600 font-medium">Delete</button>
      </div>
    </div>
  );
};

export default MyProductReviewCard;

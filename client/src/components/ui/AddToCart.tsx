"use client";
import React, { useState } from "react";
import { FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";

const AddToCart = () => {
  const [stock, setStock] = useState(10);
  const [quantity, setQuantity] = useState(1);

  const updateQuantity = (type: "i" | "d") => {
    if (type === "i") {
      const inc = quantity + 1;
      setQuantity((p) => (inc > stock ? p : inc));
    } else {
      const dec = quantity - 1;
      setQuantity((p) => (dec < 1 ? 1 : dec));
    }
  };
  return (
    <div className="flex md:flex-row flex-col md:items-center   gap-2">
      <div className="flex items-center md:justify-around justify-between gap-2 p-2 border-2 border-blue-100 rounded-md">
        <button onClick={() => updateQuantity("i")} className="p-2">
          <FaPlus />
        </button>
        <input
          type="number"
          className="w-24  border-none outline-none text-center font-medium "
          readOnly={false}
          value={quantity}
          onChange={() => {}}
        />
        <button onClick={() => updateQuantity("d")} className="p-2">
          <FaMinus />
        </button>
      </div>
      <button className="px-8 py-3 active:opacity-20 bg-primary text-white hover:bg-secondary hover:text-black hover:rounded-lg duration-75  font-medium">
        ADD TO CART
      </button>
      <div className="flex items-center  gap-2">
        <button className="p-2 bg-blue-50 w-fit  text-3xl">
          <FaRegHeart />
        </button>
        <button className="p-2 bg-blue-50 w-fit  text-3xl">
          <IoShareSocialOutline />
        </button>
      </div>
    </div>
  );
};

export default AddToCart;

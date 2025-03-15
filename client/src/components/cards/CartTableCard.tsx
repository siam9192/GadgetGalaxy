"use client";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaBangladeshiTakaSign, FaRegTrashCan } from "react-icons/fa6";

interface IProps {
  isLast: boolean;
}

const CartTableCard = ({ isLast }: IProps) => {
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
    <tr
      className={`bg-white ${!isLast ? " border-b" : ""} dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:cursor-pointer hover:bg-gray-50 `}
    >
      <td className="md:px-6 py-4">
        <input type="checkbox" className="md:size-5 size-4 accent-primary" />
      </td>
      <th scope="row" className="md:px-6 py-4 font-medium  whitespace-nowrap dark:text-white">
        <div className="flex lg:flex-row flex-col items-center">
          <img
            src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
            alt=""
            className="md:size-32 size-20"
          />
          <div className="md:space-y-2 space-y-1  lg:w-fit  text-wrap">
            <h4 className="lg:text-xl md:text-lg ">I Phone 14 pro max</h4>
            <p className="  text-gray-900/75 md:text-sm text-[0.7rem] text-wrap">
              Color:Blue|Storage:128GB|Region:UK
            </p>
            <button className="text-primary font-medium md:text-[1rem] text-sm">Change</button>
          </div>
        </div>
      </th>
      <td className="md:px-6 px-2 py-4">
        <h6 className="flex items-center gap-1 font-primary">
          <span className="text-black md:text-xl text-lg">
            <FaBangladeshiTakaSign />
          </span>
          <span className="md:text-2xl text-xl font-medium text-primary ">2378</span>
          <del className=" text-lg font-medium text-gray-800 ">2378</del>
        </h6>
      </td>
      <td className="md:px-6 px-2 py-4">
        <div className="flex items-center gap-2 p-2 border-2 border-blue-100 rounded-md w-fit">
          <button onClick={() => updateQuantity("i")} className="p-2">
            <FaPlus />
          </button>
          <input
            type="number"
            className="md:w-24 w-18  border-none outline-none text-center font-medium "
            readOnly={false}
            value={quantity}
            onChange={() => {}}
          />
          <button onClick={() => updateQuantity("d")} className="p-2">
            <FaMinus />
          </button>
        </div>
      </td>
      <td className="md:px-6 px-2 py-4">
        <h6 className="flex items-center gap-1 font-primary">
          <span className="text-black md:text-xl text-lg">
            <FaBangladeshiTakaSign />
          </span>
          <span className="md:text-2xl text-xl font-semibold text-primary ">2378</span>
        </h6>
      </td>
      <td className="md:px-6 px-2 py-4 text-right">
        <button className="text-2xl  p-3 bg-gray-50 rounded-full">
          <FaRegTrashCan />
        </button>
      </td>
    </tr>
  );
};

export default CartTableCard;

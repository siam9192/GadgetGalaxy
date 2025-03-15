"use client";
import React, { useContext, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaBangladeshiTakaSign, FaRegTrashCan } from "react-icons/fa6";
import { CartContext } from "../sections/cart/CartItems";
import { IoTrashOutline } from "react-icons/io5";

interface IProps {
  isLast: boolean;
}

const CartCard = ({ isLast }: IProps) => {
  const [stock, setStock] = useState(10);
  const [quantity, setQuantity] = useState(1);

  const contextValue = useContext(CartContext)!;
  const { isSelectAll, selectedItems, setSelectedItems } = contextValue;
  const [isSelected, setIsSelected] = useState(
    stock && stock >= quantity && isSelectAll ? true : false,
  );

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
    <div
      className={`bg-white ${!isLast ? " border-b" : ""} dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:cursor-pointer hover:bg-gray-50 md:p-5 p-3  relative `}
    >
      <div className="">
        <input
          checked={isSelected}
          type="checkbox"
          className="md:size-5 size-4 accent-primary"
          onChange={(e) => {
            setIsSelected(e.target.checked);
          }}
          readOnly={false}
        />
      </div>
      <div className="flex  lg:gap-10 md:gap-5 gap-3 md:flex-nowrap flex-wrap">
        <div className="w-[60%] flex items-center md:gap-4 gap-2">
          <img
            src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
            alt=""
            className="md:size-20 size-14"
          />
          <div className=" md:space-y-2 space-y-0.5">
            <h3 className="font-medium md:text-[1rem] text-sm">I Phone 15 pro max</h3>
            <div className="flex items-center gap-2 md:flex-nowrap flex-wrap md:text-sm text-[0.7rem] text-gray-700">
              <p>125GB|Black|Global|4GB|SIM2</p>
              <button className="text-info font-medium">Change</button>
            </div>
          </div>
        </div>
        <div className="md:w-[40%] w-full flex justify-between items-center">
          <div className="flex items-center md:justify-around justify-between gap-2 md:p-2 p-1 border-2 border-blue-100 rounded-md  md:w-32 w-20">
            <button onClick={() => updateQuantity("i")} className="text-sm">
              <FaPlus />
            </button>
            <input
              type="number"
              className="w-full  border-none outline-none text-center font-medium md:text-[1rem] text-sm "
              readOnly={false}
              value={quantity}
              onChange={() => {}}
            />
            <button onClick={() => updateQuantity("d")} className="text-sm">
              <FaMinus />
            </button>
          </div>
          <div>
            <h1 className="flex items-center  md:text-xl text-[0.9rem] font-semibold font-primary">
              <FaBangladeshiTakaSign />
              <span>6546.00</span>
            </h1>
            <h4 className="flex items-center   justify-end  md:text-[1rem] text-[0.7rem] font-semibold font-primary  ">
              <span>{quantity}x</span>
              <span className="text-primary">6546.00</span>
            </h4>
          </div>
        </div>
      </div>
      <button className="p-2 md:text-xl text-sm bg-gray-50 rounded-full absolute right-0 top-1">
        <IoTrashOutline />
      </button>
    </div>
  );
};

export default CartCard;

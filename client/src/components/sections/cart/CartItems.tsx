"use client";
import CartCard from "@/components/cards/CartCard";
import CartTableCard from "@/components/cards/CartTableCard";
import React, { createContext, useState } from "react";

interface IContextProps {
  isSelectAll: boolean;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CartContext = createContext<IContextProps | null>(null);

const CartItems = () => {
  const [isSelectAll, setIsSelectAll] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const total = 12;

  const contextValue = {
    isSelectAll,
    selectedItems,
    setSelectedItems,
  };

  return (
    <div className="relative w-full overflow-x-auto  p-5 bg-white">
      <div className="flex items-center gap-2 md:px-5 px-3 font-medium mb-2">
        <input
          onChange={(e) => setIsSelectAll(e.target.checked)}
          defaultChecked={isSelectAll}
          type="checkbox"
          className="md:size-5 size-4 accent-primary"
        />
        <label htmlFor="" className="md:text-xl">
          Select All
        </label>
      </div>
      <CartContext.Provider value={contextValue}>
        <div>
          {Array.from({ length: total }).map((_, index) => (
            <CartCard isLast={index + 1 === total} key={index} />
          ))}
        </div>
      </CartContext.Provider>
    </div>
  );
};

export default CartItems;

"use client";
import CartCard from "@/components/cards/CartCard";
import EmptyCartMessage from "@/components/ui/EmptyCartMessage";
import { useGetMyCartItemsQuery } from "@/redux/features/cart/cart.api";
import { updateItem, updateItems } from "@/redux/features/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import React, { createContext, useEffect, useState } from "react";

interface IContextProps {
  isSelectAll: boolean;
}

export const CartContext = createContext<IContextProps | null>(null);

const CartItems = () => {
  const [isSelectAll, setIsSelectAll] = useState(true);
  const dispatch = useAppDispatch();
  const total = 12;
  const contextValue: IContextProps = {
    isSelectAll,
  };
  const { data, isLoading } = useGetMyCartItemsQuery(undefined);
  const items = data?.data || [];

  useEffect(() => {
    dispatch(updateItems(items));
  }, [items]);

  useEffect(() => {
    if (items) {
      items.forEach((_) => {
        dispatch(updateItem({ id: _.id, isSelected: isSelectAll }));
      });
    }
  }, [isSelectAll, items]);

  if (isLoading)
    return (
      <div className="p-5 h-60">
        <p>Loading...</p>
      </div>
    );

  if (!items.length) return <EmptyCartMessage />;
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
          {items.map((_, index) => (
            <CartCard item={_} isLast={index + 1 === total} key={index} />
          ))}
        </div>
      </CartContext.Provider>
    </div>
  );
};

export default CartItems;

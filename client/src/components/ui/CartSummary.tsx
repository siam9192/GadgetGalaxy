"use client";
import { useAppSelector } from "@/redux/hook";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CartSummary = () => {
  const { subtotal, grandTotal, discountTotal, discountCode, items } = useAppSelector(
    (state) => state.cartSlice,
  );
  const [isFade, setIsFade] = useState(false);

  useEffect(() => {
    setIsFade(true);
    const timeout = setTimeout(() => {
      setIsFade(false);
    }, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [items, discountTotal]);
  const router = useRouter();
  const handelGoNext = () => {
    const data = {
      subtotal,
      grandTotal,
      discountTotal,
      items: items.filter((_) => _.isSelected === true),
      discountCode,
    };
    localStorage.setItem("checkout-data", JSON.stringify(data));
    router.push("/checkout");
  };

  return (
    <div className="md:p-5 p-3 bg-white">
      <h1 className="md:text-2xl text-xl text-black font-medium pb-2 border-b-2  border-gray-800/5">
        Cart Summary
      </h1>

      <div className="mt-3">
        <div className="space-y-2">
          <div className="flex justify-between py-2 md:text-lg text-[1rem] text-gray-700 font-medium">
            <span>Subtotal:</span>
            <span className="text-primary flex items-center gap-1">
              <span
                className={`${isFade ? "opacity-20" : "opacity-100"} transition-opacity duration-75`}
              >
                {subtotal.toFixed(2)}
              </span>{" "}
              <span>BDT</span>
            </span>
          </div>

          <div className="flex justify-between py-2 md:text-lg text-[1rem] text-gray-700 font-medium">
            <span>Delivery Charge:</span>
            <span className="text-info">Will be added</span>
          </div>

          <div className="flex justify-between py-2 md:text-lg text-[1rem] text-gray-700 font-medium">
            <span>Total Discount:</span>
            <span className="text-primary flex items-center gap-1">
              <span
                className={`${isFade ? "opacity-20" : "opacity-100"} transition-opacity duration-75`}
              >
                {discountTotal.toFixed(2)}
              </span>{" "}
              <span>BDT</span>
            </span>
          </div>

          <div className="flex justify-between py-2 md:text-lg text-[1rem] text-gray-700 font-medium">
            <span>Grand Total:</span>
            <span className="text-primary flex items-center gap-1">
              <span
                className={`${isFade ? "opacity-20" : "opacity-100"} transition-opacity duration-75`}
              >
                {grandTotal.toFixed(2)}
              </span>{" "}
              <span>BDT</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 grid md:grid-cols-2 md:gap-4 gap-2">
        <Link href="/">
          <button className="w-full py-3 bg-secondary text-black font-medium">
            Continue Shopping
          </button>
        </Link>
        <button onClick={handelGoNext} className="w-full py-3 bg-primary text-white font-medium">
          Go Next
        </button>
      </div>
    </div>
  );
};

export default CartSummary;

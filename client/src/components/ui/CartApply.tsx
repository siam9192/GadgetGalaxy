"use client";
import { addDiscount } from "@/redux/features/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { applyDiscount } from "@/services/discount.service";
import React, { useEffect, useState } from "react";

const CartApply = () => {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cartItems = useAppSelector((state) => state.cartSlice.items);
  const itemsId = cartItems.filter((_) => _.isSelected).map((_) => _.id);
  const dispatch = useAppDispatch();
  const handelApplyDiscount = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const res = await applyDiscount({ code, cartItemsId: itemsId });
      if (res?.success) {
        setSuccessMessage(`${code} Applied successfully!`);

        setCode("");
        dispatch(addDiscount({ amount: res.data.discountAmount, code }));
      } else throw new Error(res?.message || "Something went wrong");
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, [cartItems]);
  return (
    <div className="md:p-5 p-3 bg-white">
      <h1 className="md:text-2xl text-xl text-black font-medium pb-2 border-b-2  border-gray-800/5">
        Have a Promo Code ?
      </h1>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full py-3 px-2  outline-none   uppercase font-primary  font-semibold bg-gray-100 rounded-md"
        />
        <button
          onClick={handelApplyDiscount}
          disabled={!code || isLoading}
          className="px-6 py-3 bg-primary disabled:bg-gray-100 disabled:text-gray-700 text-white rounded-md"
        >
          Apply
        </button>
      </div>

      <div className="mt-3">
        {code && errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : successMessage ? (
          <p className="text-green-600">{successMessage}</p>
        ) : (
          <p>No promo code applied</p>
        )}
      </div>
    </div>
  );
};

export default CartApply;

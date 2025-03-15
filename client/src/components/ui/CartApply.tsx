import React from "react";

const CartApply = () => {
  return (
    <div className="md:p-5 p-3 bg-white">
      <h1 className="md:text-2xl text-xl text-black font-medium pb-2 border-b-2  border-gray-800/5">
        Have a Promo Code ?
      </h1>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          className="w-full py-3 px-2  outline-none   uppercase font-primary  font-semibold bg-gray-100 rounded-md"
        />
        <button className="px-6 py-3 bg-primary text-white rounded-md">Apply</button>
      </div>

      <div className="mt-3">
        <p>No promo code applied</p>
      </div>
    </div>
  );
};

export default CartApply;

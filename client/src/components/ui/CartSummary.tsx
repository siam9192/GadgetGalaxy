import React from "react";

const CartSummary = () => {
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
              <span>34</span> <span>BDT</span>
            </span>
          </div>

          <div className="flex justify-between py-2 md:text-lg text-[1rem] text-gray-700 font-medium">
            <span>Delivery Charge:</span>
            <span className="text-info">Will be added</span>
          </div>

          <div className="flex justify-between py-2 md:text-lg text-[1rem] text-gray-700 font-medium">
            <span>Total Discount:</span>
            <span className="text-primary flex items-center gap-1">
              <span>34</span> <span>BDT</span>
            </span>
          </div>

          <div className="flex justify-between py-2 md:text-lg text-[1rem] text-gray-700 font-medium">
            <span>Grand Total:</span>
            <span className="text-primary flex items-center gap-1">
              <span>34</span> <span>BDT</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 grid md:grid-cols-2 md:gap-4 gap-2">
        <button className="w-full py-3 bg-secondary text-black font-medium">
          Continue Shopping
        </button>
        <button className="w-full py-3 bg-primary text-white font-medium">Checkout</button>
      </div>
    </div>
  );
};

export default CartSummary;

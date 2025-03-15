import CartItems from "@/components/sections/cart/CartItems";
import CartApply from "@/components/ui/CartApply";
import CartSummary from "@/components/ui/CartSummary";
import React from "react";

const page = () => {
  return (
    <div className="md:py-8 py-6 min-h-screen">
      <div className="p-5 bg-white border-b-2 border-gray-600/10 text-center">
        <h1 className="lg:text-5xl md:text-4xl text-3xl font-primary  font-semibold">
          My <span className="text-primary">Cart</span>
        </h1>
      </div>

      <CartItems />
      <div className="mt-5  grid lg:grid-cols-2 gap-5">
        <CartApply />
        <CartSummary />
      </div>
    </div>
  );
};

export default page;

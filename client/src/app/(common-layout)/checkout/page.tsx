"use client";
import Form from "@/components/hook-form/Form";
import BillingDetails from "@/components/sections/checkout/BillingDetails";
import CheckoutDetails from "@/components/sections/checkout/CheckoutDetails";
import React from "react";

const page = () => {
  return (
    <div className="lg:py-10 py-6">
      <div className="p-5 bg-white">
        <h1 className="md:text-3xl text-2xl  font-primary uppercase font-semibold text-gray-900">
          Checkout
        </h1>
      </div>
      <Form onSubmit={() => {}}>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 py-5 ">
          <BillingDetails />
          <CheckoutDetails />
        </div>
      </Form>
    </div>
  );
};

export default page;

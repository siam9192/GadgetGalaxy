import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="w-full  h-screen bg-white flex justify-center flex-col items-center gap-3 p-2">
      <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/payment-failed-illustration-download-in-svg-png-gif-file-formats--issue-error-transaction-fail-link-site-empty-states-pack-design-development-illustrations-3822060.png"
        alt=""
      />
      <div className="lg:w-1/2 w-full space-y-2">
        <h1 className="text-center text-2xl font-medium text-info ">Error Processing Payment!</h1>
        <p className="text-center text-gray-700 md:text-[1rem] text-sm">
          Thank you for your order! Unfortunately, the payment was unsuccessful. Please verify your
          payment details and try again. For assistance or questions, feel free to contact our
          support team anytime.
        </p>
        <div className="flex md:flex-row flex-col md:items-center  justify-center gap-3  ">
          <Link href="/cart">
            <button className="px-7 py-3 hover:bg-primary hover:text-white border-2 border-gray-700/20 rounded-md md:w-fit w-full">
              Go to Cart
            </button>
          </Link>
          <Link href="/">
            <button className="px-7 bg-primary text-white py-3 border-2 border-gray-700/20 rounded-md md:w-fit w-full">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;

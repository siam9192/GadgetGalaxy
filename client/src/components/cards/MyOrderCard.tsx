import React, { useEffect, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const MyOrderCard = () => {
  const [isClient, setIsClient] = useState(false);

  // Use effect for ssr = false for this component
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isClient) return;
      setIsClient(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  if (!isClient) return null;
  return (
    <div className="md:p-5 p-3 bg-white md:mt-3 mt-2">
      <div className="flex  gap-5">
        <div className="w-[40%] grid md:grid-cols-4 grid-cols-2 gap-2 h-full">
          <img
            src="https://pngimg.com/uploads/headphones/small/headphones_PNG101954.png"
            alt=""
            className=" aspect-square"
          />
          <img
            src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
            alt=""
            className=" aspect-square"
          />
          <img
            src="https://pngimg.com/uploads/headphones/small/headphones_PNG101954.png"
            alt=""
            className=" aspect-square"
          />
          <div className="flex items-center justify-center  flex-col  text-sm ">
            <span className="font-medium text-primary">+2 more</span>
          </div>
        </div>

        <div className="w-[60%]">
          <div className="flex items-center justify-between">
            <h4 className="   font-medium md:text-[1rem] text-sm">Order:#567889</h4>
            <h4 className="size-fit p-2 bg-blue-50  text-primary font-medium text-sm  rounded-full md:scale-100 scale-70">
              Processing
            </h4>
          </div>
          <div className="mt-2">
            <h1 className="md:text-xl font-medium ">30 Items</h1>
          </div>
          <div className="mt-2 space-y-1   md:text-sm text-[0.7rem]">
            <p className="font-medium text-gray-700  rounded-full">
              <span className="">Placed:</span> {new Date().toDateString()}-
              {new Date().toLocaleTimeString()}
            </p>
            <p className="font-medium text-gray-700  rounded-full">
              Payment Status <span className="text-info uppercase">Will be paid</span>
            </p>
            <p className="font-medium text-gray-700  rounded-full">
              <span className="">Method:</span> Cash on delivery
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex md:flex-row flex-col-reverse md:items-center justify-between">
        <p className="text-sm text-primary">Excepted Delivery on {new Date().toDateString()}</p>
        <h1 className="flex md:justify-start justify-end items-center  font-semibold font-primary ">
          <span className="text-xl text-primary font-medium">
            <FaBangladeshiTakaSign />
          </span>
          <span className="text-xl text-info">4756</span>
        </h1>
      </div>
      {/* <div className="mt-3 text-end ">
        <button className="px-6 py-2 border-2 border-blue-100 font-medium hover:bg-secondary hover:text-black hover:border-none  rounded-md">
          View Details
        </button>
      </div> */}
    </div>
  );
};

export default MyOrderCard;

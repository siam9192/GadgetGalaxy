import React from "react";

const RecentViewProductCard = () => {
  return (
    <div className="p-3 flex   hover:border-2 border-info hover:rounded-lg duration-75 hover:cursor-pointer ">
      <div className="w-[40%]">
        <img
          src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
          alt=""
          className=""
        />
      </div>
      <div className="w-full md:space-y-2 space-y-1">
        <h3 className="md:text-xl text-lg font-medium text-gray-900">iPhone 15 Plus</h3>
        <p className="text-primary font-medium md:text-xl font-primary">$765</p>
        <button className="px-4 py-2 bg-primary text-sm text-white rounded-md">Add to cart</button>
      </div>
    </div>
  );
};

export default RecentViewProductCard;

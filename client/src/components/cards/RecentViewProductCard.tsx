import { TCardProduct } from "@/types/product.type";
import { getProductPricing } from "@/utils/helpers";
import React from "react";

interface IProps {
  product: TCardProduct;
}
const RecentViewProductCard = ({ product }: IProps) => {
  const pricing = getProductPricing(product);
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
        <h3 className="md:text-xl text-lg font-medium text-gray-900">{product.name}</h3>
        <p className="text-primary font-medium md:text-xl font-primary">
          ${pricing.offerPrice || pricing.price}
        </p>
        <button className="px-4 py-2 bg-primary text-sm text-white rounded-md">Add to cart</button>
      </div>
    </div>
  );
};

export default RecentViewProductCard;

import { TCardProduct } from "@/types/product.type";
import { getProductPricing } from "@/utils/helpers";
import React from "react";
import { GoCheck } from "react-icons/go";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";

import { TbCurrencyTaka } from "react-icons/tb";
import ListCardQuickActions from "./ListCardQuickActions";
import ProductCardContainer from "../container/ProductCardContainer";
interface IProps {
  product: TCardProduct;
}
const ListProductCard = ({ product }: IProps) => {
  const pricing = getProductPricing(product);
  return (
    <ProductCardContainer slug={product.slug}>
      <div
        className={`md:p-3 p-2 bg-white shadow-xl relative  overflow-hidden hover:cursor-pointer product-card grid md:grid-cols-6 grid-cols-1  gap-5 h-fit`}
      >
        <div className="relative md:col-span-2 ">
          <img
            src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
            alt=""
            className="md:size-52"
          />
          <div className="absolute left-1 top-1 bg-info text-white md:px-4 px-3 py-1 rounded-full md:text-sm text-[0.7rem] font-unique">
            {product.discountPercentage}%
          </div>
        </div>
        <div className="md:col-span-4">
          <div className="mt-2 space-y-2">
            <h2 className="font-secondary md:text-lg text-[0.9rem]">{product.name}</h2>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className=" text-info flex items-center gap-1">
                  <span>
                    <IoIosStar />
                  </span>
                  <span>
                    <IoIosStar />
                  </span>
                  <span>
                    <IoIosStar />
                  </span>
                  <span>
                    <IoIosStar />
                  </span>
                  <span>
                    <IoIosStarHalf />
                  </span>
                </div>
                <p className="text-gray-400 text-sm">(03)</p>
              </div>
              {pricing.offerPrice ? (
                <h2 className="font-primary font-semibold md:text-lg text-[1rem] text-primary">
                  <span className="inline text-2xl">
                    <TbCurrencyTaka className="inline" />
                  </span>
                  {pricing.offerPrice}{" "}
                  <del className="text-black md:text-[1rem] text-sm">
                    {" "}
                    <span className="inline text-2xl">
                      <TbCurrencyTaka className="inline" />
                    </span>
                    {pricing.offerPrice}
                  </del>
                </h2>
              ) : (
                <h2 className="font-primary font-semibold md:text-lg text-[1rem] text-primary">
                  ${pricing.price}
                </h2>
              )}
            </div>
            <div className="font-secondary flex items-center gap-2 md:text-sm text-[0.6rem]">
              <p className="text-green-600 font-medium">
                <span className="">
                  <GoCheck className="inline md:text-xl text-sm" />
                </span>{" "}
                <span>In stock</span>
              </p>
              <p className="text-gray-700">32 Products</p>
            </div>
            <div></div>
          </div>
          <div className="mt-2">
            <p className="text-gray-700 text-sm   opacity-80">{product.description}</p>
          </div>
          <ListCardQuickActions product={product} />
        </div>
      </div>
    </ProductCardContainer>
  );
};

export default ListProductCard;

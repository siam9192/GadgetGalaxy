"use client";
import { TCardProduct } from "@/types/product.type";
import Link from "next/link";
import React from "react";
import { GoCheck } from "react-icons/go";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { LuHeart, LuSearch } from "react-icons/lu";
import ProductCardContainer from "../container/ProductCardContainer";
import ProductRating from "../ui/ProductRating";
import { TbCurrencyTaka } from "react-icons/tb";
import { getProductPricing } from "@/utils/helpers";
import { useRemoveFromWishListMutation } from "@/redux/features/wishList/wishList.api";
import { toast } from "react-toastify";
interface IProps {
  index?: number;
  product: TCardProduct;
}
const WishCard = ({ product, index }: IProps) => {
  const pricing = getProductPricing(product);
  const [removeWishList, { isLoading }] = useRemoveFromWishListMutation();
  const remove = async () => {
    try {
      const res = await removeWishList(product.id);

      if (res.data?.success) {
      } else {
        throw new Error((res.error as any)?.data.message);
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  return (
    <ProductCardContainer slug={product.slug}>
      <div
        className={`md:p-3 p-2 bg-white shadow-xl relative  overflow-hidden hover:cursor-pointer product-card ${index !== undefined && (index + 1) % 2 === 0 ? " md:mt-0 " : ""}`}
      >
        <div className="relative">
          <img
            src="https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
            alt=""
            className="w-full"
          />
          {product.discountPercentage >= 5 && (
            <div className="absolute left-1 top-1 bg-info text-white md:px-4 px-3 py-1 rounded-full md:text-sm text-[0.7rem] font-unique">
              {product.discountPercentage}%
            </div>
          )}
        </div>
        <div className="mt-2 space-y-2">
          <h2 className="font-secondary md:text-lg text-[0.9rem]">{product.name}</h2>
          <div className="space-y-1">
            <ProductRating rating={product.rating} />

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
            <p className="text-gray-700">{product.availableQuantity} Products</p>
          </div>
          <div></div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();

            remove();
          }}
          disabled={isLoading}
          className="text-xl bg-secondary hover:bg-info p-2 rounded-full  text-black absolute right-2 top-1"
        >
          <LuHeart />
        </button>
      </div>
    </ProductCardContainer>
  );
};

export default WishCard;

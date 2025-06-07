
import React from "react";
import { GoCheck } from "react-icons/go";


import ProductCardContainer from "../container/ProductCardContainer";
import { TCardProduct } from "@/types/product.type";
import { getProductPricing } from "@/utils/helpers";
import { TbCurrencyTaka } from "react-icons/tb";
import CardQuickActions from "../ui/CardQuickActions";
import ProductRating from "../ui/ProductRating";
import { RxCross1 } from "react-icons/rx";
interface IProps {
  index?: number;
  product: TCardProduct;
}
const ProductTestCard = ({ product, index }: IProps) => {
  const pricing = getProductPricing(product);
  const variant = product.variants[0];
  const isInStock = (variant ? variant.availableQuantity : product.availableQuantity) > 0;
  const availableQuantity = variant ? variant.availableQuantity : product.availableQuantity;

  return (
    <ProductCardContainer slug={product.slug}>
      <div
        className={`md:p-3 p-2 bg-white shadow-xl relative  overflow-hidden hover:cursor-pointer product-card flex flex-col  ${index !== undefined && (index + 1) % 2 === 0 ? " md:mt-0 " : ""} h-full`}
      >
        <div className="relative h-52">
          <img src={product.images[0].url} alt="" className="w-full  max-h-52" />
          {product.discountPercentage >= 5 && (
            <div className="absolute left-1 top-1 bg-info text-white md:px-4 px-3 py-1 rounded-full md:text-sm text-[0.7rem] font-unique">
              {product.discountPercentage}%
            </div>
          )}
        </div>
         <div className="mt-2 grow">
            <h2 className="font-secondary md:text-lg text-[0.9rem]">{product.name}</h2>
          </div>

        <div className="mt-2 space-y-2">
         
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
        </div>
        <div className="font-secondary flex items-center gap-2 md:text-sm text-[0.6rem]">
          {isInStock ? (
            <p className="text-green-600 font-medium">
              <span className="">
                <GoCheck className="inline md:text-xl text-sm" />
              </span>{" "}
              <span>In stock</span>
            </p>
          ) : (
            <p className="text-info font-medium">
              <span className="">
                <RxCross1 className="inline md:text-xl text-sm" />
              </span>{" "}
              <span>Stock out</span>
            </p>
          )}
          <p className="text-gray-700">{availableQuantity} Products</p>
        </div>
        <CardQuickActions product={product} />
      </div>
    </ProductCardContainer>
  );
};

export default ProductTestCard;

"use client";
import AddToCart from "@/components/ui/AddToCart";
import ProductRating from "@/components/ui/ProductRating";
import { IProduct, TVariant } from "@/types/product.type";
import { SearchParams } from "next/dist/server/request/search-params";
import React, { useState } from "react";
import ProductVariants from "./ProductVariants";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

interface IProps {
  product: IProduct;
}

const ProductBasicInfo = ({ product }: IProps) => {
  const [selectedVariant, setSelectedVariant] = useState<TVariant | null>(null);
  const handelVariantOnChange = (v: TVariant) => {
    setSelectedVariant(v);
  };

  const pricing = {
    price: selectedVariant ? selectedVariant.price : product.price,
    offerPrice: selectedVariant ? selectedVariant.offerPrice : product.offerPrice,
  };
  return (
    <div className="p-5  bg-white  flex flex-col h-full ">
      <div className=" grow">
        <div>
          <p className="text-end font-medium">
            <span className="text-primary ">SKU</span>: {selectedVariant?.sku || product.sku}
          </p>
          {(selectedVariant ? selectedVariant.availableQuantity : product.availableQuantity) ===
          0 ? (
            <p className="text-info ">Out of stock</p>
          ) : (
            <p className="text-green-600">In Stock</p>
          )}
          <h1 className="md:text-3xl text-2xl font-primary text-black  ">{product.name}</h1>
        </div>
        <div className="mt-3 space-y-2">
          <h5 className="md:text-4xl text-3xl text-primary font-semibold font-primary">
            <span>
              <FaBangladeshiTakaSign className="inline mb-2" />
            </span>
            {pricing.price}
            {pricing.offerPrice ? (
              <del className="text-2xl text-gray-700">
                {" "}
                <span>
                  <FaBangladeshiTakaSign className="inline mb-2" />
                </span>
                {pricing.offerPrice}
              </del>
            ) : null}
          </h5>

          <ProductRating rating={product.rating} />
          <p className="text-sm text-gray-800/80">{product.description.slice(0, 200)}</p>
        </div>
      </div>
      <ProductVariants product={product} onChange={handelVariantOnChange} />
      <div className="mt-3">
        <AddToCart
          availableQuantity={
            selectedVariant ? selectedVariant.availableQuantity : product.availableQuantity
          }
          productId={product.id}
          variantId={selectedVariant?.id || null}
          isWishListed={product.isWishListed}
        />
      </div>
      <p className="mt-3 font-secondary text-info text-sm">
        ঢাকার বাহীরের অর্ডারের ক্ষেত্রে ৩০০ টাকা 01888 719 119 বিকাশ মার্চেন্ট নাম্বারে Make Payment
        করে অর্ডার নিশ্চিত করুন ।অন্যথায় অর্ডার ক্যান্সেল হয়ে যাবে ।
      </p>
    </div>
  );
};

export default ProductBasicInfo;

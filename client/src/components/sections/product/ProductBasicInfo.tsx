
import AddToCart from "@/components/ui/AddToCart";
import ProductRating from "@/components/ui/ProductRating";
import { IProduct } from "@/types/product.type";
import { getProductPricing } from "@/utils/helpers";
import { SearchParams } from "next/dist/server/request/search-params";
import Link from "next/link";
import React, { useState } from "react";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";
import ProductVariants from "./ProductVariants";


interface IProps {
  product:IProduct,
  searchParams:SearchParams
}

const ProductBasicInfo = ({product,searchParams}:IProps) => {
 
 



  

  return (
    <div className="p-5  bg-white  flex flex-col h-full ">
   <div className=" grow"> 
   <div >
        <p className="text-end font-medium">
          <span className="text-primary ">SKU</span>: {product.sku}
        </p>
     {
      product.availableQuantity === 0 ?
      <p className="text-info ">Out of stock</p>
      :
      <p className="text-green-600">In Stock</p>
     }
        <h1 className="md:text-3xl text-2xl font-primary text-black  ">
          {product.name}
        </h1>
      </div>
      <div className="mt-3 space-y-2">
        <h5 className="md:text-4xl text-3xl text-primary font-semibold font-primary">
          ${product.price} <del className="text-2xl text-gray-700">${product.offerPrice}</del>
        </h5>

        <ProductRating rating={product.rating}/>
        <p className="text-sm text-gray-800/80">
          {product.description.slice(0,200)}
        </p>
      </div>
   </div>
   <ProductVariants product={product}/>
      <div className="mt-3">
        <AddToCart />
      </div>
      <p className="mt-3 font-secondary text-info text-sm">
        ঢাকার বাহীরের অর্ডারের ক্ষেত্রে ৩০০ টাকা 01888 719 119 বিকাশ মার্চেন্ট নাম্বারে Make Payment
        করে অর্ডার নিশ্চিত করুন ।অন্যথায় অর্ডার ক্যান্সেল হয়ে যাবে ।
      </p>
    </div>
  );
};

export default ProductBasicInfo;

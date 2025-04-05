'use client'
import { TCardProduct } from '@/types/product.type'
import React from 'react'
import { IoCartOutline } from "react-icons/io5";
import { LuHeart, LuSearch } from "react-icons/lu";
import { ProductQuickView } from "../ui/ProductQuickView";
interface IProps {
    product:TCardProduct
}
const CardQuickActions = ({product}:IProps) => {
  return (
    <div  onClick={(e)=>e.stopPropagation()} className="absolute top-0 -right-[100%] button-group   ease-in-out duration-300  flex items-center gap-3 flex-col w-fit py-3 px-1">
          {product.variants.length > 0 && (
            <button className="text-xl bg-primary p-2 rounded-full  text-white">
              <IoCartOutline />
            </button>
          )}
          <button className="text-xl bg-info p-2 rounded-full  text-white">
            <LuHeart />
          </button>
          <ProductQuickView />
        </div>
  )
}

export default CardQuickActions
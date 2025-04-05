"use client";
import React, { useState } from "react";
import "@/styles/imageGallery.css"
import ImageGalleryPopup from "./ProductImageGalleryPopup";
import { TProductImage } from "@/types/product.type";

type TProps =  {
  images:TProductImage[]
}

const ProductImageGallery = ({images:a}:TProps) => {
  const images = Array.from({ length: 5 }).map(_=>"https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg");
  const [activeIndex,setActiveIndex] = useState(0)
  const [prevActiveIndex,setPrevActiveIndex] = useState(0)

  const handelChangeActiveIndex = (index:number)=>{
    setPrevActiveIndex(activeIndex)
    setActiveIndex(index)
  }


  

  return (
    <div className="bg-white p-5 flex flex-col">
      <div className=" grow overflow-hidden">
      {
        images.map((imgUrl,index)=>{
          if(activeIndex !== index) return null
          return <div key={index}>
          <img
        src={imgUrl}
        alt=""
        className={`md:max-w-[60%] mx-auto ${prevActiveIndex<index ? "previewImageAnimate1":"previewImageAnimate2"} `}
      />
      </div>
        })
      }
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-5  grid-cols-4 gap-2 ">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={()=>handelChangeActiveIndex(index)}
            className={` p-2 border-2 border-gray-900/10 hover:border-info hover:cursor-pointer  rounded-md ${activeIndex === index ? 'border-info border-2':''}`}
          >
            <img
              src={image}
              alt=""
            />
          </div>
        ))}
      <ImageGalleryPopup images={a}/>
      </div>
    </div>
  );
};

export default ProductImageGallery;

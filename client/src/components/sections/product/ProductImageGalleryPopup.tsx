'use client';
import { TProductImage } from '@/types/product.type'
import React, { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx';

interface IProps {
  images:TProductImage[]
}

const ProductImageGalleryPopup = ({images}:IProps) => {
  const [isOpen,setIsOpen] = useState(false)
 
  if(images.length <= 5)return null
  

useEffect(()=>{
    document.body.style.overflow = isOpen ? 'hidden':''
  },[isOpen])

 const [activeIndex,setActiveIndex] = useState(0)
   const [prevActiveIndex,setPrevActiveIndex] = useState(0)
 
   const handelChangeActiveIndex = (index:number)=>{
     setPrevActiveIndex(activeIndex)
     setActiveIndex(index)
   }
  return (
   <>
    <div onClick={()=>setIsOpen(true)} className="p-2  border-2 border-gray-900/10 rounded-md flex items-center text-center justify-center flex-col  min-h-20">
    <p className="font-medium text-sm">+{images.length-5} More</p>
  </div>
{
  isOpen ? <div onClick={()=>setIsOpen(false)} className=' bg-gray-900/50 fixed inset-0 flex justify-center items-center z-50'>
         <div onClick={(e)=>e.stopPropagation()} className='lg:w-1/2 w-full min-h-60 lg:h-fit  h-full p-5 border-2 bg-black'>
        <div className= 'lg:mt-0 mt-10'>
        {
        images.map((img,index)=>{
          if(activeIndex !== index) return null
          return <div key={index}>
          <img
        src={img.url}
        alt=""
        className={`md:max-w-[60%] mx-auto  previewImageAnimate3`}
      />
      </div>
        })
      }
        </div>
        <div className="mt-5 flex flex-wrap  gap-2 mx-auto w-fit ">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={()=>handelChangeActiveIndex(index)}
            className={` p-2 border-2 border-gray-900/10 hover:border-info hover:cursor-pointer  rounded-md ${activeIndex === index ? 'border-info border-2':''}`}
          >
            <img
              src={image.url}
              alt=""
              className='md:size-20 size-10'
            />
          </div>
        ))}
    
      </div>
         </div>
         <button onClick={()=>setIsOpen(false)} className='text-2xl text-white absolute top-2 right-2 p-2 border-2 rounded-full lg:hidden '>
          <RxCross2/>
         </button>
  </div>
  :
  null
}
   </>
  )
}

export default ProductImageGalleryPopup
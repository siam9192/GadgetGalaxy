"use client";
import React, { KeyboardEvent, useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { TbCurrencyTaka } from "react-icons/tb";
import ProductRating from "./ProductRating";
import { RxCross2 } from "react-icons/rx";
import "@/styles/util.css";
import { useGetSearchKeywordResultsQuery } from "@/redux/features/utils/utils.api";
import { useRouter } from "next/navigation";
const ResponsiveSearchBox = () => {
  const [isOpen, setIsOpen] = useState(false);

    
   const [keyword,setKeyword] = useState('');
 
   const {data,isLoading,isFetching} = useGetSearchKeywordResultsQuery(keyword)
 
   const results =  data?.data||[]
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
   if(!isOpen){
    setKeyword('')
   }
  }, [isOpen]);


    const handelKeywordSearch = (e:KeyboardEvent<HTMLInputElement>)=>{
      setIsOpen(true)
      if(e.key.toLowerCase() !== 'enter' ) return
     router.push(`/search?searchTerm=${keyword}`)
    }
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-3xl text-black relative  lg:hidden block"
      >
        <LuSearch />
      </button>
      {isOpen ? (
        <div className="fixed inset-0 bg-white h-full z-50 p-2 responsive-searchbox ">
          <input
            type="text"
            placeholder="Enter search keyword.."
            onChange={(e)=>setKeyword(e.target.value)}
            onKeyDown={handelKeywordSearch}
            className="w-full  bg-gray-100 px-2  py-3"
          />

          <div className="h-screen overflow-y-auto pb-5">
   {
    isLoading || isFetching ?

    <p>Loading...</p>:
    results.map((item, index) => {
      if (item.type === "product") {
        return (
          <div key={index} className="p-2 hover:bg-gray-100 ">
            <p className="text-primary font-medium text-sm mb-1">Product</p>
            <div className="flex items-center gap-2">
              <img
                src={
                  "https://adminapi.applegadgetsbd.com/storage/media/large/iPhone-14-Pro-Deep-Purple-7300.jpg"
                }
                alt=""
                className="size-16"
              />
              <div>
                <h5 className="text-lg ">{item.name}</h5>
                <h3 className="text-primary font-semibold flex items-center ">
                  <span className="text-xl">
                    <TbCurrencyTaka />
                  </span>
                  <span>{item.price}</span>
                </h3>
                <ProductRating rating={4} />
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div key={index} className="p-3 hover:bg-gray-100">
            <p className="text-info font-medium text-sm mb-1">Category</p>
            <div className=" flex gap-2 ">
              <img
                src={"https://gadgetz.com.bd/wp-content/uploads/2024/04/10000mAh.png"}
                alt=""
                className="size-16"
              />
              <div>
                <h5 className="text-lg">{item.name}</h5>
                <h6 className="text-gray-800 text-sm">{item.hierarchySte}</h6>
              </div>
            </div>
          </div>
        );
      }
    })
   }
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 bg-info text-white text-2xl fixed right-4 bottom-10 rounded-full"
          >
            <RxCross2 />
          </button>
        </div>
      ) : null}
    </>
  );
};

export default ResponsiveSearchBox;

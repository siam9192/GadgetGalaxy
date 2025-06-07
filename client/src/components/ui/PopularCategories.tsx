"use client";
import Container from "@/components/container/Container";
import { getPopularCategories } from "@/services/category.service";
import { ICategory } from "@/types/category.type";
import { defaultImagesUrl } from "@/utils/constant";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PopularCategories = () => {
  const [current, setCurrent] = useState(0);
  const [showLength, setShowLength] = useState(6);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const updateShowLength = () => {
    if (window.innerWidth < 640) {
      setShowLength(2);
    } else if (window.innerWidth < 1024) {
      setShowLength(4);
    } else {
      setShowLength(6);
    }
    setContainerWidth(containerRef.current?.clientWidth || 0);
  };

  useEffect(() => {
    updateShowLength();
    window.addEventListener("resize", updateShowLength);
    return () => window.removeEventListener("resize", updateShowLength);
  }, []);

  useEffect(() => {
    fetchPopularCategories();
  }, []);

  async function fetchPopularCategories() {
    try {
      const categories = await getPopularCategories();
      if (categories && categories.length) {
        setCategories(categories);
        setCurrent(0); // reset on load
      }
    } catch (error) {
      console.log("Popular category fetch failed");
    }
  }

  const total = categories.length;

  const handleChangeCurrent = (type: "p" | "n") => {
  const maxCurrent = Math.max(total - showLength, 0); // prevent negative scroll

  if (type === "n") {
    setCurrent((prev) => Math.min(prev + 1, maxCurrent));
  } else {
    setCurrent((prev) => Math.max(prev - 1, 0));
  }
};

  const router = useRouter();
  const cardWidthPercentage =  100 / showLength
  
  return (
    <Container className="bg-white mt-5 p-5 md:p-10 shadow relative">
      <div
        ref={containerRef}
        className="relative w-full h-[150px] md:h-[200px] flex items-center justify-center overflow-hidden"
      >
       
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-3 rounded-md flex-shrink-0 hover:border-primary hover:border-2 hover:cursor-pointer transition-transform duration-200 absolute top-0  h-full "
              
               style={{
            transform: `translateX(-${current * 100}%)`,
             width: `${cardWidthPercentage}%` ,
             left:`${index * cardWidthPercentage}%`
          }}
              onClick={() => router.push(`/product-category/${category.slug}`)}
            >
              <img
                src={category.imageUrl || defaultImagesUrl.category}
                alt={category.name}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md"
              />
              <h5 className="text-black font-medium mt-2 text-sm text-center md:text-base">
                {category.name}
              </h5>
            </div>
          ))}
        </div>
      

      {/* Navigation Buttons */}
      {total > showLength && (
        <>
          <button
            onClick={() => handleChangeCurrent("p")}
            className="absolute left-2 md:-left-6 top-1/2 transform -translate-y-1/2 text-2xl md:text-3xl text-white p-2 md:p-3 bg-primary hover:bg-info rounded-full"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => handleChangeCurrent("n")}
            className="absolute right-2 md:-right-6 top-1/2 transform -translate-y-1/2 text-2xl md:text-3xl text-white p-2 md:p-3 bg-primary hover:bg-info rounded-full"
          >
            <FaChevronRight />
          </button>
        </>
      )}
    </Container>
  );
};

export default PopularCategories;

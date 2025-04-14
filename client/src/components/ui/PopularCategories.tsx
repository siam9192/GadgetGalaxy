"use client";
import Container from "@/components/container/Container";
import { getPopularCategories } from "@/services/category.service";
import { ICategory } from "@/types/category.type";
import { defaultImagesUrl } from "@/utils/constant";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const categories = [
//   {
//     name: "Smartphones",
//     imageUrl: "https://example.com/images/smartphones.jpg",
//     slug: "smartphones",
//   },
//   { name: "Laptops", imageUrl: "https://example.com/images/laptops.jpg", slug: "laptops" },
//   { name: "Tablets", imageUrl: "https://example.com/images/tablets.jpg", slug: "tablets" },
//   {
//     name: "Smartwatches",
//     imageUrl: "https://example.com/images/smartwatches.jpg",
//     slug: "smartwatches",
//   },
//   { name: "Headphones", imageUrl: "https://example.com/images/headphones.jpg", slug: "headphones" },
//   {
//     name: "Gaming Consoles",
//     imageUrl: "https://example.com/images/gaming-consoles.jpg",
//     slug: "gaming-consoles",
//   },
//   { name: "Cameras", imageUrl: "https://example.com/images/cameras.jpg", slug: "cameras" },
//   { name: "Drones", imageUrl: "https://example.com/images/drones.jpg", slug: "drones" },
//   { name: "TVs", imageUrl: "https://example.com/images/tvs.jpg", slug: "tvs" },
//   { name: "Speakers", imageUrl: "https://example.com/images/speakers.jpg", slug: "speakers" },
//   {
//     name: "Accessories",
//     imageUrl: "https://example.com/images/accessories.jpg",
//     slug: "accessories",
//   },
//   {
//     name: "Wearable Tech",
//     imageUrl: "https://example.com/images/wearable-tech.jpg",
//     slug: "wearable-tech",
//   },
// ];

const PopularCategories = () => {
  const [current, setCurrent] = useState(0);
  const [showLength, setShowLength] = useState(6);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [categories, setCategories] = useState<ICategory[]>([]);
  useEffect(() => {
    const updateShowLength = () => {
      if (window.innerWidth < 640) {
        setShowLength(2); // Mobile
      } else if (window.innerWidth < 1024) {
        setShowLength(4); // Tablet
      } else {
        setShowLength(6); // Desktop
      }
      setContainerWidth(containerRef.current?.clientWidth || 0);
    };
    updateShowLength();
    window.addEventListener("resize", updateShowLength);
    return () => window.removeEventListener("resize", updateShowLength);
  }, []);

  const total = categories.length;

  const handleChangeCurrent = (type: "p" | "n") => {
    if (type === "n") {
      // if( total-showedLength === 3 )return setCurrent(0)
      setCurrent((prev) => (prev + showLength < total ? prev + 1 : 0));
    } else {
      setCurrent((prev) => (prev - 1 >= 0 ? prev - 1 : total - showLength));
    }
  };
  // const showedLength = (current + 1) * showLength;
  // console.log("current", current, "length", current + showLength);

  useEffect(() => {
    fetchPopularCategories();
  }, []);

  async function fetchPopularCategories() {
    try {
      const categories = await getPopularCategories();
      if (categories && categories.length) {
        setCategories(categories);
      }
    } catch (error) {
      console.log("Popular category fetch failed");
    }
  }

  const router = useRouter();

  return (
    <Container className="bg-white mt-5 p-5 md:p-10 shadow relative ">
      <div
        ref={containerRef}
        className="relative flex justify-center items-center  overflow-hidden "
      >
        <div
          className="flex transition-transform duration-500 ease-in-out  "
          style={{ transform: `translateX(-${current * (containerWidth! / showLength)}px)` }}
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-3   rounded-md flex-shrink-0  hover:border-primary hover:border-2 hover:cursor-pointer"
              style={{ width: `${containerWidth! / showLength}px` }}
              onClick={() => router.push(`/product-category/${category.slug}`)}
            >
              <img
                src={category.imageUrl || defaultImagesUrl.category}
                alt={category.name}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md"
              />
              <h5 className="text-black font-medium mt-2 text-sm md:text-base">{category.name}</h5>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
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
    </Container>
  );
};

export default PopularCategories;

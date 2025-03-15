import ProductCard from "@/components/cards/ProductCard";
import Container from "@/components/container/Container";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

const ShopByBrands = () => {
  const brands = [
    {
      logoUrl: "https://adminapi.applegadgetsbd.com/storage/media/thumb/Apple-6176.png",
    },
    {
      logoUrl: "https://adminapi.applegadgetsbd.com/storage/media/thumb/Samsung-4680.png",
    },
    {
      logoUrl: "https://adminapi.applegadgetsbd.com/storage/media/thumb/Oneplus-9091.png",
    },
    {
      logoUrl: "https://adminapi.applegadgetsbd.com/storage/media/thumb/Xiaomi-1934.png",
    },
    {
      logoUrl: "https://adminapi.applegadgetsbd.com/storage/media/thumb/Google-4283.png",
    },
  ];
  return (
    <section className="md:py-10 py-6">
      <Container className="">
        <div className="p-5 bg-white shadow-xl border-b border-gray-600/15 font-medium flex items-center justify-between font-primary">
          <h1 className="md:text-2xl text-xl font-semibold uppercase">Shop By Brands</h1>
          <button className="flex items-center gap-2 text-gray-700 font-semibold hover:text-primary">
            <span>View All</span>
            <span>
              <FaChevronRight />
            </span>
          </button>
        </div>
        <div className="p-5 bg-white lg:grid-cols-none grid grid-cols-4    lg:flex items-center flex-wrap md:justify-center lg:gap-7 md:gap-5 gap-3">
          {brands.map((brand, index) => (
            <img key={index} src={brand.logoUrl} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ShopByBrands;

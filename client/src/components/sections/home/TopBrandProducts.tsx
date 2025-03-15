"use client";
import ProductCard from "@/components/cards/ProductCard";
import Container from "@/components/container/Container";
import React, { useState } from "react";

const TopBrandProducts = () => {
  const topBrands = [
    "Apple",
    "Samsung",
    "Sony",
    "Microsoft",
    "Dell",
    "HP",
    "Lenovo",
    "Asus",
    "Acer",
    "Google",
    "OnePlus",
    "Xiaomi",
  ];
  const [active, setActive] = useState(topBrands[0]);
  return (
    <section className="lg:py-10 py-6">
      <Container className="">
        <div className="p-5 bg-white shadow font-medium flex items-center justify-between font-primary">
          <h1 className="md:text-2xl text-xl font-semibold uppercase">
            <span className="text-info">Top</span> Brand Products
          </h1>
          <div className="flex items-center gap-2"></div>
        </div>
        <div className="p-5  bg-white shadow font-medium flex flex-wrap items-center md:justify-center font-primary gap-4">
          {topBrands.map((brand) => (
            <div key={brand}>
              <input type="radio" name="top-brand" id={"top-brand-" + brand} className="hidden" />
              <label
                htmlFor={"top-brand-" + brand}
                onClick={() => setActive(brand)}
                className={`${brand === active ? "border-b-4 border-primary" : "null"} text-lg font-medium hover:cursor-pointer active:opacity-30 transition-opacity duration-100  rounded-md`}
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
        <div className=" mt-5 grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-2">
          {Array.from({
            length: 12,
          }).map((_, index) => (
            <ProductCard key={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TopBrandProducts;

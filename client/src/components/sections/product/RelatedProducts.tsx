import ProductCard from "@/components/cards/ProductCard";
import React from "react";

const RelatedProducts = () => {
  return (
    <section className="md:py-10 py-6">
      <div className="p-5 bg-white shadow font-medium flex items-center justify-between font-primary">
        <h1 className="md:text-2xl text-xl font-semibold uppercase">
          <span className="text-info">Related</span> Products
        </h1>
      </div>
      <div className=" mt-5 grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-2">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <ProductCard key={index} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;

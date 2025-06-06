import ProductCard from "@/components/cards/ProductCard";
import ProductLoadingCard from "@/components/cards/ProductLoadingCard";
import ProductTestCard from "@/components/cards/ProductTestCard";
import Container from "@/components/container/Container";
import { getFeaturedProducts } from "@/services/product.service";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

const FeaturedProducts = async () => {
  const products = await getFeaturedProducts();

  return (
    <section className="md:py-10 py-6">
      <Container className="">
        <div className="p-5 bg-white shadow font-medium flex items-center justify-between font-primary">
          <h1 className="md:text-2xl text-xl font-semibold uppercase">
            <span className="text-primary">Featured</span> Products
          </h1>
          <button className="flex items-center gap-2 text-gray-700 font-semibold hover:text-primary">
            <span>View More</span>
            <span>
              <FaChevronRight />
            </span>
          </button>
        </div>
        <div className=" mt-5 grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-2">
          {products.map((_, index) => (
            <ProductTestCard product={_} key={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProducts;

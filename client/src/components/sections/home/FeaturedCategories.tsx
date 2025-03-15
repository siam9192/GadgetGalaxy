import ProductCard from "@/components/cards/ProductCard";
import Container from "@/components/container/Container";
import PopularCategories from "@/components/ui/PopularCategories";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FeaturedCategories = () => {
  return (
    <section className="md:py-10 py-6">
      <Container>
        <div className="p-5 bg-white shadow font-medium flex items-center justify-between font-primary">
          <h1 className="md:text-2xl text-xl font-semibold uppercase">Popular Categories</h1>
          <button className="flex items-center gap-2 text-gray-700 font-semibold hover:text-primary">
            <span>View More</span>
            <span>
              <FaChevronRight />
            </span>
          </button>
        </div>
      </Container>
      <PopularCategories />
    </section>
  );
};

export default FeaturedCategories;

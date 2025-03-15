import BestDealProductCard from "@/components/cards/BestDealProductCard";
import Container from "@/components/container/Container";
import React from "react";
import { FaFire } from "react-icons/fa";

const BestDeals = () => {
  return (
    <section className="md:py-10 py-6">
      <Container>
        <div className="p-5 bg-white shadow font-medium flex items-center gap-2 font-primary">
          <span className="text-2xl text-info">
            <FaFire className="inline" />
          </span>
          <h1 className="md:text-2xl text-xl font-semibold uppercase">Best Deals</h1>
        </div>

        <div className="mt-5 p-5 bg-white grid lg:grid-cols-2 grid-cols-1 md:gap-10 gap-5 shadow-xl">
          {Array.from({ length: 4 }).map((_, index) => (
            <BestDealProductCard key={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BestDeals;

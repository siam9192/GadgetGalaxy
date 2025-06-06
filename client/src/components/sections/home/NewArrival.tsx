import ProductCard from "@/components/cards/ProductCard";
import ProductTestCard from "@/components/cards/ProductTestCard";
import Container from "@/components/container/Container";
import { getNewArrivalProducts } from "@/services/product.service";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

const NewArrival = async () => {
  const products = await getNewArrivalProducts();
  return (
    <section className="lg:py-10 py-6">
      <Container className="">
        <div className="p-5 bg-white shadow font-medium flex items-center justify-between font-primary">
          <h1 className="md:text-2xl text-xl font-semibold uppercase">
            New <span className="text-info">Arrival</span>
          </h1>
          <button className="flex items-center gap-2 text-gray-700 font-semibold hover:text-primary">
            <span>View More</span>
            <span>
              <FaChevronRight />
            </span>
          </button>
        </div>
        <div className=" mt-5 grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-2">
          {products?.map((_, index) => <ProductTestCard product={_} key={index} />)}
        </div>
      </Container>
    </section>
  );
};

export default NewArrival;

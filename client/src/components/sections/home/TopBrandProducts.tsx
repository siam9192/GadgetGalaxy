"use client";
import ProductLoadingCard from "@/components/cards/ProductLoadingCard";
import ProductTestCard from "@/components/cards/ProductTestCard";
import Container from "@/components/container/Container";
import useLoadingBouncer from "@/hooks/useLoadingBouncer";
import { getTopBrands } from "@/services/brand.service";
import { getTopBrandsProducts } from "@/services/product.service";
import { TCardProduct } from "@/types/product.type";
import React, { useEffect, useState } from "react";

const TopBrandProducts = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [products, setProducts] = useState<TCardProduct[]>([]);

  // Fetch top brands on mount
  useEffect(() => {
    fetchTopBrands();
  }, []);

  useEffect(() => {
    if (activeIndex !== null) {
      fetchTopProducts();
    }
  }, [activeIndex]);

  const fetchTopBrands = async () => {
    try {
      const fetchedBrands = await getTopBrands();
      setBrands(fetchedBrands || []);
      if (fetchedBrands?.length) {
        setActiveIndex(0); // Trigger fetchTopProducts via useEffect
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchTopProducts = async () => {
    setIsLoading(true);
    try {
      const brand = brands[activeIndex!]; // Safe because we check for null in useEffect
      const fetchedProducts = await getTopBrandsProducts(brand.id);
      setProducts(fetchedProducts || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const bouncedLoading = useLoadingBouncer({ isLoading, delay: 1000 });

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
          {brands.map((brand, index) => (
            <div key={index}>
              <input type="radio" name="top-brand" id={"top-brand-" + brand} className="hidden" />
              <label
                htmlFor={"top-brand-" + brand}
                onClick={() => setActiveIndex(index)}
                className={`${index === activeIndex ? "border-b-4 border-primary" : "null"} text-lg font-medium hover:cursor-pointer active:opacity-30 transition-opacity duration-100  rounded-md`}
              >
                {brand.name}
              </label>
            </div>
          ))}
        </div>
        <div className=" mt-5 grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-2">
          {bouncedLoading
            ? Array.from({ length: 12 }).map((_, index) => <ProductLoadingCard key={index} />)
            : products.map((_, index) => <ProductTestCard product={_} key={index} />)}
        </div>
      </Container>
    </section>
  );
};

export default TopBrandProducts;

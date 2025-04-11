"use client";
import RecentViewProductCard from "@/components/cards/RecentViewProductCard";
import { getRecentViewedProducts } from "@/services/product.service";
import { TCardProduct } from "@/types/product.type";
import React, { useEffect, useState } from "react";

const RecentlyViewedProducts = () => {
  const [products, setProducts] = useState<TCardProduct[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const raw = sessionStorage?.getItem("recent-view");
      const stored: number[] = raw ? JSON.parse(raw) : [];
      stored.pop();
      const fetchedData = await getRecentViewedProducts(
        stored.filter((_) => typeof _ === "number").join(","),
      );
      setProducts(fetchedData?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  return (
    <div className="p-5 bg-white min-h-60">
      <h1 className="text-xl uppercase text-center font-semibold font-primary pb-2 border-b-2 border-gray-700/20  ">
        Recently Viewed
      </h1>
      {products.length ? (
        <div className="mt-5 grid lg:grid-cols-1 md:grid-cols-2  grid-cols-1 gap-4">
          {products.map((_, index) => (
            <RecentViewProductCard product={_} key={index} />
          ))}
        </div>
      ) : (
        <p className="mt-3">No product</p>
      )}
    </div>
  );
};

export default RecentlyViewedProducts;

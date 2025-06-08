"use client";
import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import "@/styles/util.css";
import ProductImageGallery from "../sections/product/ProductImageGallery";
import ProductBasicInfo from "../sections/product/ProductBasicInfo";
import { IProduct, TCardProduct } from "@/types/product.type";
import { getProductDetails } from "@/services/product.service";
import useLoadingBounce from "@/hooks/useLoadingBouncer";

interface IProps {
  slug: string;
  closeFn?: () => void;
}

export const ProductQuickView = ({ slug, closeFn }: IProps) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const raw = sessionStorage?.getItem("recent-view");
      const stored: number[] = raw ? JSON.parse(raw) : [];
      stored.pop();
      const fetchedData = await getProductDetails(slug);
      setProduct(fetchedData?.data || null);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const bouncedLoading = useLoadingBounce({ isLoading, delay: 400 });
  if (bouncedLoading)
    return (
      <div className="h-60 flex justify-center items-center flex-col bg-white">
        <h1 className="text-xl text-center">Loading..</h1>
      </div>
    );
  if (!product) return <p>Something went wrong</p>;
  return (
    <div className="grid grid-cols-1 gap-5">
      <ProductImageGallery images={product?.images} />
      <ProductBasicInfo product={product} />
    </div>
  );
};

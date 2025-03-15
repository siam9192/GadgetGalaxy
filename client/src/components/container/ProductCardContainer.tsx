"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}
const ProductCardContainer = ({ children }: IProps) => {
  const router = useRouter();

  return (
    <div className="hover:cursor-pointer" onClick={() => router.push("/product/slug")}>
      {children}
    </div>
  );
};

export default ProductCardContainer;

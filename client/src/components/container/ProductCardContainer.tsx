"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface IProps {
  slug:string
  children: ReactNode;
}

const ProductCardContainer = ({ children,slug}: IProps) => {
  const router = useRouter();

  const handelClick = () => router.push("/product/"+slug);
  return <div onClick={handelClick} className="hover:cursor-pointer">{children}</div>;
};

export default ProductCardContainer;

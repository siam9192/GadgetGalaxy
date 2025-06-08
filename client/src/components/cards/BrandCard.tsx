import Link from "next/link";
import React from "react";
interface IProps {
  brand: IBrand;
}
const BrandCard = ({ brand }: IProps) => {
  return (
    <Link href={`/product-brand/${brand.name}`}>
      <div className="p-5 bg-white hover:scale-95 duration-75 h-full">
        <h1 className="text-xl font-medium text-primary">{brand.name}</h1>
        <img src={brand.logoUrl} alt="" className="mx-auto w-52 " />
      </div>
    </Link>
  );
};

export default BrandCard;

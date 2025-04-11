import Link from "next/link";
import React from "react";
interface IProps {
  brand: IBrand;
}
const BrandCard = ({ brand }: IProps) => {
  return (
    <Link href={`/product-brand/${brand.name}`}>
      <div className="p-5 bg-white hover:scale-95 duration-75">
        <h1 className="text-xl font-medium text-primary">{brand.name}</h1>
        <img
          src="https://adminapi.applegadgetsbd.com/storage/media/thumb/Xiaomi-1934.png"
          alt=""
          className="mx-auto "
        />
      </div>
    </Link>
  );
};

export default BrandCard;

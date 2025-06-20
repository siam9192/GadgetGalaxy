import { ICategory } from "@/types/category.type";
import { defaultImagesUrl } from "@/utils/constant";
import Link from "next/link";
import React from "react";

type TProps = {
  category: ICategory;
};

const CategoryCard = ({ category }: TProps) => {
  return (
    <Link href={`/product-category/${category.slug}`} className="h-full ">
      <div className="md:p-5 p-2 bg-blue-50 rounded-md border-2 border-blue-700/15 flex flex-col h-full">
        <div className="grow">
          <img src={defaultImagesUrl.category} alt="" />
          <h6 className="uppercase text-center mt-3 font-medium  opacity-60">{category.name}</h6>
        </div>

        <p className="text-sm text-center mt-2 font-medium">
          Products <span className="text-info">({category._count?.products || 0})</span>
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;

import ListProductCard from "@/components/cards/ListProductCard";
import ProductCard from "@/components/cards/ProductCard";
import { ECardViewType, TCardViewType } from "@/types/util.type";
import React from "react";
interface IProps {
  searchParams: Record<string, string>;
}
const ShowSearchProducts = ({ searchParams }: IProps) => {
  let cardViewType: TCardViewType = "grid";
  if (searchParams) cardViewType = searchParams.viewType as TCardViewType;

  return (
    <section>
      {cardViewType === ECardViewType.LIST ? (
        <div className="grid  grid-cols-1 md:gap-3 gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <ListProductCard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-3 gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCard index={index} key={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ShowSearchProducts;

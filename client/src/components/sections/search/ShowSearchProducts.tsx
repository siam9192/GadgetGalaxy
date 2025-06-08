import ListProductCard from "@/components/cards/ListProductCard";
import ProductCard from "@/components/cards/ProductCard";
import ProductTestCard from "@/components/cards/ProductTestCard";
import { TCardProduct } from "@/types/product.type";
import { ECardViewType, TCardViewType } from "@/types/util.type";
import { SearchParams } from "next/dist/server/request/search-params";
import React from "react";
interface IProps {
  searchParams: SearchParams;
  products: TCardProduct[];
}
const ShowSearchProducts = ({ searchParams, products }: IProps) => {
  let cardViewType: TCardViewType = "grid";
  if (searchParams) cardViewType = searchParams.viewType as TCardViewType;

  return (
    <section className="min-h-[60vh]">
      {cardViewType === ECardViewType.LIST ? (
        <div className="grid  grid-cols-1 md:gap-3 gap-2">
          {products.map((product, index) => (
            <ListProductCard product={product} key={index} />
          ))}
        </div>
      ) : (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 md:gap-3 gap-2">
          {products.map((product, index) => (
            <ProductTestCard product={product} key={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ShowSearchProducts;

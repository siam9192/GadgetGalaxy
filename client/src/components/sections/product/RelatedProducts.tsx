import ProductCard from "@/components/cards/ProductCard";
import ProductTestCard from "@/components/cards/ProductTestCard";
import { getRelatedProducts } from "@/services/product.service";
import { Params } from "next/dist/server/request/params";
import React from "react";

const RelatedProducts = async({slug}:{slug:string}) => {

  const data = await getRelatedProducts(slug)
  const products =  data?.data||[]
  if(!products.length) return null
  return (
    <section className="md:py-10 py-6">
      <div className="p-5 bg-white shadow font-medium flex items-center justify-between font-primary">
        <h1 className="md:text-2xl text-xl font-semibold uppercase">
          <span className="text-info">Related</span> Products
        </h1>
      </div>
     {
      products.length ?
      <div className=" mt-5 grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-2">
      {products.map((_, index) => (
        <ProductTestCard product={_} key={index} />
      ))}
    </div>
    :
    <div className="h-60 p-5">
      <p>No products</p>
    </div>
     }
    </section>
  );
};

export default RelatedProducts;

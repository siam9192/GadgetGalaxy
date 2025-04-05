import ShowSearchProducts from "@/components/sections/search/ShowSearchProducts";
import ProductsPagination from "@/components/ui/ProductsPagination";
import React from "react";
import { PageProps } from "../../../../.next/types/app/layout";
import Container from "@/components/container/Container";
import SearchPageHeader from "@/components/sections/search/SearchPageHeader";
import SearchPageFilterBox from "@/components/ui/SearchPageFilterBox";
import { getSearchProducts } from "@/services/product.service";
import { IParam } from "@/types/util.type";

const page = async ({ searchParams }: PageProps) => {
  const params = Object.entries( await searchParams).map(([name,value])=>({
    name,
    value
  }))
  const data = await getSearchProducts(params as IParam[]);
  const products = data?.data||[]
 const meta = data?.meta
  return (
    <Container className="mt-3">
   {
    data?.meta &&    <SearchPageHeader meta={data?.meta} />
   }
      <div className="lg:grid grid-cols-7 gap-5 min-h-screen ">
        <div className="col-span-2 lg:block hidden">
          <SearchPageFilterBox />
        </div>
        <div className="col-span-5  ">
       {
        meta?.totalResult ?
        <div className="bg-blue-100 md:p-5 p-2">
            
           
          
        <ShowSearchProducts products={products} searchParams={await searchParams} />
        <ProductsPagination meta={meta!} />
    
  
     </div>
     :
     <div className="min-h-60 p-2">
       <p>
        No result found
       </p>
     </div>
       }
        </div>
      </div>
    </Container>
  );
};

export default page;

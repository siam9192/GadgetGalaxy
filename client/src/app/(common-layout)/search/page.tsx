import ShowSearchProducts from "@/components/sections/search/ShowSearchProducts";
import ProductsPagination from "@/components/ui/ProductsPagination";
import React from "react";

import Container from "@/components/container/Container";
import SearchPageHeader from "@/components/sections/search/SearchPageHeader";
import SearchPageFilterBox from "@/components/ui/SearchPageFilterBox";
import { getSearchProducts } from "@/services/product.service";
import { IPageProps, IParam } from "@/types/util.type";

const page = async ({ searchParams }: IPageProps) => {
  const params = Object.entries(await searchParams).map(([name, value]) => ({
    name,
    value,
  }));
  const data = await getSearchProducts(params as IParam[]);
  const products = data?.data || [];
  const meta = data?.meta;
  return (
    <Container className="mt-3">
      {data?.meta && <SearchPageHeader meta={data?.meta} />}
      <div className="lg:grid grid-cols-7 gap-5 min-h-screen ">
        <div className="col-span-2 lg:block hidden">
          <SearchPageFilterBox />
        </div>
        <div className="col-span-5  ">
          {meta?.totalResult ? (
            <div className="bg-blue-100 md:p-5 p-2">
              <ShowSearchProducts products={products} searchParams={await searchParams} />
              <ProductsPagination meta={meta!} />
            </div>
          ) : (
            <div className="min-h-60 p-2">
              <img
                className="mx-auto"
                src="https://cdni.iconscout.com/illustration/premium/thumb/no-product-illustration-download-in-svg-png-gif-file-formats--ecommerce-package-empty-box-online-shopping-pack-e-commerce-illustrations-6632286.png?f=webp"
                alt=""
              />
              <h1 className="text-center text-black font-medium mt-4">No Products found</h1>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default page;

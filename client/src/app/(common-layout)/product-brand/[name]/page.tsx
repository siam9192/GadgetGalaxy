import ShowSearchProducts from "@/components/sections/search/ShowSearchProducts";
import ProductsPagination from "@/components/ui/ProductsPagination";
import React from "react";
import { PageProps } from "../../../../../.next/types/app/layout";
import Container from "@/components/container/Container";
import { getBrandProducts, getCategoryProducts } from "@/services/product.service";
import { IParam } from "@/types/util.type";
import SearchPageHeader from "@/components/sections/search/SearchPageHeader";
import ProductBrandPageFilterBox from "@/components/ui/ProductBrandPageFilterBox";

const page = async ({ searchParams, params }: PageProps) => {
  const name = (await params).name;
  const paramsC = Object.entries(await searchParams).map(([name, value]) => ({
    name,
    value,
  })) as IParam[];

  const data = await getBrandProducts(name, paramsC);

  const meta = data?.meta;
  const products = data?.data || [];
  return (
    <div>
      <Container className="mt-3">
        {data?.meta && <SearchPageHeader meta={data?.meta} />}
        <div className="lg:grid grid-cols-7 gap-5 min-h-screen ">
          <div className="col-span-2 lg:block hidden">
            <ProductBrandPageFilterBox />
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
    </div>
  );
};

export default page;

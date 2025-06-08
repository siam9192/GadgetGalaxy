import ShowSearchProducts from "@/components/sections/search/ShowSearchProducts";
import ProductsPagination from "@/components/ui/ProductsPagination";
import React from "react";
import Container from "@/components/container/Container";
import SubCategories from "@/components/sections/product-category/SubCategories";
import ProductCategoryPageHeader from "@/components/sections/product-category/ProductCategoryPageHeader";
import ProductCategoryPageFilterBox from "@/components/ui/ProductCategoryPageFilterBox";
import { getCategoryProducts } from "@/services/product.service";
import { IPageProps, IParam } from "@/types/util.type";

const page = async ({ searchParams, params }: IPageProps) => {
  const slug = (await params).slug;
  const paramsC = Object.entries(await searchParams).map(([name, value]) => ({
    name,
    value,
  })) as IParam[];

  const data = await getCategoryProducts(slug, paramsC);
  const meta = data?.meta;
  const products = data?.data || [];
  return (
    <div>
      <Container className="mt-3">
        <SubCategories />
        {meta && <ProductCategoryPageHeader meta={meta} />}
        <div className="lg:grid grid-cols-7 gap-5 min-h-screen ">
          <div className="col-span-2 lg:block hidden">
            <ProductCategoryPageFilterBox />
          </div>
          <div className="col-span-5  ">
            <div className="bg-blue-100 md:p-5 p-2">
              <ShowSearchProducts products={products} searchParams={await searchParams} />
              {meta && <ProductsPagination meta={meta} />}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default page;

import Container from "@/components/container/Container";
import SearchPageFilterBox from "@/components/ui/SearchPageFilterBox";
import React from "react";
import { LayoutProps } from "../../../../../.next/types/app/layout";
import SearchPageHeader from "@/components/sections/search/SearchPageHeader";
import SubCategories from "@/components/sections/product-category/SubCategories";
import ProductCategoryPageFilterBox from "@/components/ui/ProductCategoryPageFilterBox";
import ProductCategoryPageHeader from "@/components/sections/product-category/ProductCategoryPageHeader";

const layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Container className="mt-3">
        <SubCategories />
        <ProductCategoryPageHeader />
        <div className="lg:grid grid-cols-7 gap-5 min-h-screen ">
          <div className="col-span-2 lg:block hidden">
            <ProductCategoryPageFilterBox />
          </div>
          <div className="col-span-5  ">{children}</div>
        </div>
      </Container>
    </div>
  );
};

export default layout;

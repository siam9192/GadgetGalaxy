import React from "react";
import { LayoutProps } from "../../../../.next/types/app/layout";
import Container from "@/components/container/Container";
import SearchPageFilterBox from "@/components/ui/SearchPageFilterBox";
import SearchPageHeader from "@/components/sections/search/SearchPageHeader";

const layout = ({ children }: LayoutProps) => {
  return (
    <Container className="mt-3">
      <SearchPageHeader />
      <div className="lg:grid grid-cols-7 gap-5 min-h-screen ">
        <div className="col-span-2 lg:block hidden">
          <SearchPageFilterBox />
        </div>
        <div className="col-span-5  ">{children}</div>
      </div>
    </Container>
  );
};

export default layout;

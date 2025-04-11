import BrandCard from "@/components/cards/BrandCard";
import Container from "@/components/container/Container";
import BrandsPagination from "@/components/ui/BrandsPagination";
import { getBrands } from "@/services/brand.service";
import React from "react";
import { PageProps } from "../../../../.next/types/app/layout";
import { IParam } from "@/types/util.type";

const page = async ({ searchParams }: PageProps) => {
  const params = Object.entries(await searchParams).map(([name, value]) => ({
    name,
    value,
  })) as IParam[];

  const res = await getBrands(params);

  const brands = res?.data || [];
  const meta = res?.meta;

  return (
    <div className="min-h-screen py-10">
      <Container>
        <div className="grid grid-cols-4 gap-4 ">
          {brands.map((_, index) => (
            <BrandCard brand={_} key={index} />
          ))}
        </div>
        {meta && <BrandsPagination meta={meta} />}
      </Container>
    </div>
  );
};

export default page;

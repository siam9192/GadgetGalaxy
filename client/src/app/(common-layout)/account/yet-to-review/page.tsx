"use client";
import YetToReviewCard from "@/components/cards/YetToReviewCard";
import Pagination from "@/components/pagination/Pagination";
import Select from "@/components/select/Select";
import { useGetMyNotReviewedItemsQuery } from "@/redux/features/product-review/product-review.api";
import { IParam } from "@/types/util.type";
import React, { useEffect, useRef, useState } from "react";

const page = () => {
  const sortOptions = [
    {
      display: "Sort by latest (desc-asc)",
      value: "",
    },

    {
      display: "Sort by latest (asc-desc)",
      value: "createdAt_asc",
    },
    {
      display: "Sort by amount (asc-desc)",
      value: "totalAmount_asc",
    },
    {
      display: "Sort by amount (desc-asc)",
      value: "totalAmount_desc",
    },
  ];
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    orderBy: "",
    sortOrder: "",
  });
  const params: IParam[] = [
    {
      name: "page",
      value: page,
    },
    {
      name: "orderBy",
      value: sort.orderBy,
    },
    {
      name: "sortOrder",
      value: sort.sortOrder,
    },
  ];
  const { data, isLoading, refetch } = useGetMyNotReviewedItemsQuery(params);

  const items = data?.data || [];
  const meta = data?.meta;

  const renderRef = useRef(false);

  useEffect(() => {
    if (!renderRef.current) {
      renderRef.current = true;
    } else {
      refetch();
    }
  }, [page, sort]);

  const handelSorting = (value: string) => {
    if (value) {
      const [orderBy, sortOrder] = value.split("_");

      setSort({
        orderBy,
        sortOrder,
      });
    } else {
      setSort({
        sortOrder: "",
        orderBy: "",
      });
    }
  };

  return (
    <div>
      <div className="mt-5 flex justify-end">
        <div className="lg:w-1/3  ">
          <Select options={sortOptions} onChange={handelSorting} />
        </div>
      </div>
      {meta?.totalResult ? (
        <div className="mt-5 grid md:grid-cols-2 grid-cols-1 md:gap-5 gap-2 min-h-[50vh]">
          {items.map((_, index) => (
            <YetToReviewCard item={_} key={index} />
          ))}
        </div>
      ) : (
        <div className="mt-5  p-10">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/empty-reviews-illustration-download-in-svg-png-gif-file-formats--dislike-logo-no-product-review-ecommerce-states-pack-e-commerce-shopping-illustrations-9741050.png?f=webp"
            alt=""
            className="mx-auto"
          />
          <h1 className="text-center mt-3 text-2xl text-primary font-medium">
            You have no items for review
          </h1>
        </div>
      )}

      {meta && meta.totalResult ? (
        <div className="mt-5 flex justify-center">
          <Pagination
            {...meta}
            onPageChange={(page) => {
              setPage(page);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default page;

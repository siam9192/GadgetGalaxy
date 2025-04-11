"use client";
import MyOrderCard from "@/components/cards/MyOrderCard";
import Pagination from "@/components/pagination/Pagination";
import Select from "@/components/select/Select";
import { useGetMyOrdersQuery } from "@/redux/features/order/order.api";

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
  const { data, isLoading, refetch } = useGetMyOrdersQuery(params);

  const orders = data?.data || [];
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
          <Select onChange={handelSorting} options={sortOptions} />
        </div>
      </div>
      {meta?.totalResult ? (
        <div className="mt-5">
          {orders.map((_, index) => (
            <MyOrderCard order={_} key={index} />
          ))}
        </div>
      ) : (
        <div className="mt-5  p-10">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/girl-with-empty-shopping-basket-illustration-download-in-svg-png-gif-file-formats--stroller-cart-no-order-products-pack-e-commerce-illustrations-10018102.png?f=webp"
            alt=""
            className="mx-auto"
          />
          <h1 className="text-center mt-3 text-2xl text-primary font-medium">You have no orders</h1>
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

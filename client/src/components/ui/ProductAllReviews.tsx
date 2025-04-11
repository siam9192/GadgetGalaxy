import { useGetProductReviewsQuery } from "@/redux/features/product-review/product-review.api";
import { IProductReview } from "@/types/product-review.type";
import React, { UIEvent, useEffect, useRef, useState } from "react";
import ProductReviewCard from "../cards/ProductReviewCard";
import { IParam } from "@/types/util.type";

interface IProps {
  productName: string;
  productId: number;
}
const sortOptions = [
  {
    display: "Sort by Latest",
    value: "",
  },
  {
    display: "Sort by Oldest",
    value: "createdAt_asc",
  },
  {
    display: "Sort by Rating(H-L)",
    value: "rating_desc",
  },
  {
    display: "Sort by Rating(L-H)",
    value: "rating_asc",
  },
];

const ProductAllReviews = ({ productName, productId }: IProps) => {
  const [allReviews, setAllReviews] = useState<IProductReview[]>([]);
  const [page, setPage] = useState(1);
  const ref = useRef<HTMLDivElement>(null);

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

  const { data, isLoading, isFetching, refetch } = useGetProductReviewsQuery({
    id: productId,
    params,
  });

  const reviews = data?.data;
  const meta = data?.meta;
  const totalPage = meta ? Math.ceil(meta?.totalResult / meta?.limit) : 1;
  useEffect(() => {
    if (!isFetching && !isLoading && reviews) {
      setAllReviews((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newReviews = reviews.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newReviews];
      });
    }
  }, [isFetching, isLoading, reviews]);

  const handleOnScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement; // Cast to HTMLDivElement

    if (
      target.scrollTop + target.clientHeight + 50 >= target.scrollHeight &&
      meta &&
      page < totalPage
    ) {
      setTimeout(() => {
        setPage((p) => p + 1);
      }, 400);
    }
  };

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
    setPage(1);
  };

  const isRendered = useRef(false);
  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    } else {
      refetch();
    }
  }, [page, sort]);

  return (
    <div
      ref={ref}
      onScroll={handleOnScroll}
      className="lg:h-[90vh] h-screen overflow-y-auto no-scrollbar p-3"
    >
      {" "}
      <h1 className="text-xl text-black font-medium">
        Review of <span className="text-primary">{productName}</span>
      </h1>
      <div className="flex   justify-end  lg:mt-0 mt-2">
        <select
          onChange={(e) => handelSorting(e.target.value)}
          name=""
          id=""
          className="px-2 py-3 min-w-32 bg-blue-50 outline-none "
        >
          {sortOptions.map((op) => (
            <option value={op.value} key={op.display}>
              {op.display}
            </option>
          ))}
        </select>
      </div>
      {meta?.totalResult ? (
        <div className="mt-5 grid lg:grid-cols-2 grid-cols-1 gap-4">
          {allReviews.map((_, index) => (
            <ProductReviewCard review={_} key={index} />
          ))}
        </div>
      ) : (
        <div className="mt-1 ">
          <h1 className="text-xl font-medium text-black"> This product have no review</h1>
        </div>
      )}
      {isLoading || isFetching ? (
        <p className="mt-2 text-gray-800 font-medium">Loading...</p>
      ) : null}
    </div>
  );
};

export default ProductAllReviews;

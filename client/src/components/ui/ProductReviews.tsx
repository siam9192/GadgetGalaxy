"use client";
import React from "react";
import ProductReviewCard from "../cards/ProductReviewCard";
import ProductReviewsPopup from "../sections/product/ProductReviewsPopup";
import { useGetProductReviewsQuery } from "@/redux/features/product-review/product-review.api";

const ProductReviews = ({ productId, productName }: { productId: number; productName: string }) => {
  const { data, isLoading } = useGetProductReviewsQuery({ id: productId, params: [] });
  const reviews = data?.data;
  const meta = data?.meta;

  return (
    <div id="product-reviews" className="p-5 bg-white">
      <h1 className="text-2xl  font-primary font-semibold  pb-2 border-b-4 pr-3 border-primary w-fit">
        Reviews <span className="text-info text-xl">({meta?.total})</span>
      </h1>
      <>
        {meta && meta?.totalResult > 0 ? (
          <div>
            <div className="mt-5 grid grid-cols-1 gap-4 min-h-[40vh]">
              {reviews?.map((_, index) => <ProductReviewCard review={_} key={index} />)}
            </div>
            {meta.totalResult > meta.limit ? (
              <div className="mt-3 flex justify-end">
                <ProductReviewsPopup productName={productName} productId={productId}>
                  <button className="text-info  font-medium">View All</button>
                </ProductReviewsPopup>
              </div>
            ) : null}
            <div className="mt-3 flex justify-end">
              <ProductReviewsPopup productName={productName} productId={productId}>
                <button className="text-info  font-medium">View All</button>
              </ProductReviewsPopup>
            </div>
          </div>
        ) : (
          <div className="min-h-[40vh]">
            <img
              className="mx-auto"
              src="https://cdni.iconscout.com/illustration/premium/thumb/empty-reviews-illustration-download-in-svg-png-gif-file-formats--dislike-logo-no-product-review-customer-ecommerce-states-pack-e-commerce-shopping-illustrations-9741060.png"
              alt=""
            />
            <h1 className="mt-3 text-center text-primary font-medium text-xl">
              This product have no review
            </h1>
          </div>
        )}
      </>
    </div>
  );
};

export default ProductReviews;

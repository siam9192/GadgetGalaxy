import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import "@/styles/util.css";
import EditProductReviewForm from "../forms/EditProductReviewForm";
import { IProductReview } from "@/types/product-review.type";
const EditProductReview = ({ review }: { review: IProductReview }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="ext-sm text-primary font-medium">
        edit
      </button>
      {isOpen ? (
        <div
          onClick={() => setIsOpen(false)}
          className="bg-gray-900/40 fixed inset-0  flex flex-col items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="lg:w-1/2 md:w-10/12 md:h-fit w-full h-full  animation-arrive-fade-up  bg-white md:rounded-lg md:min-h-60 p-5"
          >
            <EditProductReviewForm
              review={review}
              onSuccess={() => {
                setIsOpen(false);
              }}
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-1  right-2 p-2 bg-red-100  rounded-full md:hidden block text-xl "
            >
              <RxCross1 />
            </button>
          </div>
        </div>
      ) : (
        false
      )}
    </>
  );
};

export default EditProductReview;

import React, { useEffect, useState } from "react";
import PostProductReviewForm from "../forms/PostProductReviewForm";
import { RxCross1 } from "react-icons/rx";
import "@/styles/util.css";
const PostProductReview = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 border-2 text-sm bg-primary text-white font-medium hover:bg-secondary hover:text-black hover:border-none  rounded-md"
      >
        Review
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
            <PostProductReviewForm
              productName=""
              id={id}
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

export default PostProductReview;

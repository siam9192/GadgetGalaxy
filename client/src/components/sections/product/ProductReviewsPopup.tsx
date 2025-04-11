import ProductAllReviews from "@/components/ui/ProductAllReviews";
import React, { ReactNode, useEffect, useState } from "react";

type TProps = {
  productId: number;
  productName: string;
  children: ReactNode;
};

const ProductReviewsPopup = ({ productId, children, productName }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="size-fit">
        {children}
      </div>
      {isOpen ? (
        <div
          onClick={() => setIsOpen(false)}
          className=" bg-gray-900/50 fixed inset-0 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="lg:w-10/12 w-full bg-white  overflow-y-auto no-scrollbar"
          >
            <ProductAllReviews productId={productId} productName={productName} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductReviewsPopup;

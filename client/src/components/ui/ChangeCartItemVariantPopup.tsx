import React, { ReactNode, useEffect, useState } from "react";
import ChangeCartItemVariant from "./ChangeCartItemVariant";
import { ICartItem } from "@/types/cartItem.type";
interface IProps {
  item: ICartItem;
  children: ReactNode;
}
const ChangeCartItemVariantPopup = ({ item, children }: IProps) => {
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
            className="lg:w-1/3 w-10/12 bg-white min-h-60 p-5 overflow-y-auto no-scrollbar"
          >
            <ChangeCartItemVariant item={item} onChange={() => setIsOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ChangeCartItemVariantPopup;

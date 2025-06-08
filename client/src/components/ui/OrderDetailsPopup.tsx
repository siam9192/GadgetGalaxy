import React, { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";

interface IProps {
  orderId: number;
}

function OrderDetailsPopup(props: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2  font-medium bg-primary text-white hover:bg-secondary hover:text-black hover:border-none  rounded-md"
      >
        View Details
      </button>

      {isOpen ? (
        <div
          onClick={() => setIsOpen(false)}
          className=" bg-gray-900/50 fixed inset-0 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="lg:w-1/2 w-10/12 bg-white h-[80vh] p-5 overflow-y-auto no-scrollbar rounded-xl"
          >
            <OrderDetails orderId={props.orderId} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default OrderDetailsPopup;

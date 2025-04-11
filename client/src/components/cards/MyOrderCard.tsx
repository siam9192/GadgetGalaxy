import { useCancelOrderMutation } from "@/redux/features/order/order.api";
import { EOrderStatus, IMyOrder } from "@/types/order.type";
import { capitalizeFirstWord } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { toast } from "react-toastify";
import ConfirmPopup from "../popup/ConfirmPopup";

interface IProps {
  order: IMyOrder;
}

const MyOrderCard = ({ order }: IProps) => {
  const [isClient, setIsClient] = useState(false);

  // Use effect for ssr = false for this component
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isClient) return;
      setIsClient(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const [cancel] = useCancelOrderMutation();
  const handelCancelOrder = async () => {
    try {
      const res = await cancel(order.id);
      if (!res.data?.success) {
        throw new Error(res.data?.message);
      } else {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  if (!isClient) return null;

  const orderItems = order.items;
  const defaultShowItemTotal = 3;

  const exceptedDeliveryDateStr = order.exceptedDeliveryDate
    ? order.exceptedDeliveryDate.in
      ? new Date(order.exceptedDeliveryDate.in!).toDateString()
      : [
          new Date(order.exceptedDeliveryDate.from!).toDateString(),
          new Date(order.exceptedDeliveryDate.to!).toDateString() || "",
        ].join("-")
    : "";

  return (
    <div className="md:p-5 p-3 bg-white md:mt-3 mt-2">
      <div className="flex  gap-5">
        <div className="w-[40%] grid md:grid-cols-4 grid-cols-2 gap-2 h-full">
          {orderItems.slice(0, defaultShowItemTotal - 1).map((_, index) => (
            <img
              key={index}
              src="https://pngimg.com/uploads/headphones/small/headphones_PNG101954.png"
              alt=""
              className=" aspect-square"
            />
          ))}

          {orderItems.length - defaultShowItemTotal > 0 ? (
            <div className="flex items-center justify-center  flex-col  text-sm ">
              <span className="font-medium text-primary">
                +{orderItems.length - defaultShowItemTotal} more
              </span>
            </div>
          ) : null}
        </div>

        <div className="w-[60%]">
          <div className="flex items-center justify-between">
            <h4 className="   font-medium md:text-[1rem] text-sm">Order:#{order.id}</h4>
            <h4
              className={`size-fit p-2 ${[EOrderStatus.PLACED, EOrderStatus.IN_TRANSIT].includes(order.status as any) ? "bg-blue-50  text-primary" : EOrderStatus.DELIVERED === order.status ? "bg-green-50  text-green-500" : "bg-red-50 text-red-500"} font-medium text-sm  rounded-full md:scale-100 scale-70`}
            >
              {capitalizeFirstWord(order.status)}
            </h4>
          </div>
          <div className="mt-2">
            <h1 className="md:text-xl font-medium ">
              {orderItems.reduce((p, c) => p + c.quantity, 0)} Items
            </h1>
          </div>
          <div className="mt-2 space-y-1   md:text-sm text-[0.7rem]">
            <p className="font-medium text-gray-700  rounded-full">
              <span className="">Placed:</span> {new Date(order.createdAt).toDateString()}-
              {new Date().toLocaleTimeString()}
            </p>
            <p className="font-medium text-gray-700  rounded-full">
              Payment Status <span className="text-info uppercase">{order.paymentStatus}</span>
            </p>
            <p className="font-medium text-gray-700  rounded-full">
              <span className="">Method:</span>{" "}
              {order.payment.method === "COD" ? "Cash on Delivery" : order.payment.method}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex md:flex-row flex-col-reverse md:items-center justify-between">
        {[EOrderStatus.PLACED, EOrderStatus.PROCESSING, EOrderStatus.IN_TRANSIT].includes(
          order.status as EOrderStatus,
        ) ? (
          <p className="text-sm text-primary">Excepted Delivery on {exceptedDeliveryDateStr}</p>
        ) : (
          <p></p>
        )}
        <h1 className="flex md:justify-start justify-end items-center  font-semibold font-primary ">
          <span className="text-xl text-primary font-medium">
            <FaBangladeshiTakaSign />
          </span>
          <span className="text-xl">{order.totalAmount}</span>
        </h1>
      </div>
      <div className="mt-3  flex justify-end items-center gap-2 ">
        <button className="px-6 py-2  font-medium bg-primary text-white hover:bg-secondary hover:text-black hover:border-none  rounded-md">
          View Details
        </button>
        {order.status === EOrderStatus.PLACED ? (
          <ConfirmPopup onConfirm={handelCancelOrder} heading="Are you sure you want to cancel it?">
            <button className="px-6 py-2 border-2 border-blue-100 font-medium hover:bg-info hover:text-white hover:border-none  rounded-md">
              Cancel Order
            </button>
          </ConfirmPopup>
        ) : null}
      </div>
    </div>
  );
};

export default MyOrderCard;

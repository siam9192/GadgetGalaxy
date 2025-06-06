"use client";
import { checkoutContext } from "@/context";
import { getShippingCharges } from "@/services/shippingCharge.service";
import { IShippingCharge } from "@/types/shippingCharge.type";
import { TCheckoutData } from "@/types/util.type";
import { getCartItemPrice } from "@/utils/helpers";
import React, { useContext, useEffect, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const CheckoutDetails = () => {
  const contextValue = useContext(checkoutContext);
  const values = contextValue?.values;
  const paymentMethods = [
    {
      name: "Cash on delivery",
      value: "COD",
    },
    // {
    //     name:'Bkash payment gateway',
    //     value:"Bkash"
    // },
    {
      name: "SSL payment gateway",
      value: "Bkash",
    },
  ];

  const [shippingCharges, setShippingCharges] = useState<IShippingCharge[]>([]);
  const [isShippingChargeLoading, setShippingChargeLoading] = useState(false);
  const [data, setData] = useState<TCheckoutData | null>();

  useEffect(() => {
    setShippingChargeLoading(true);
    const data: TCheckoutData = JSON.parse(localStorage.getItem("checkout-data")!);
    setData(data);
    getShippingCharges().then((res) => {
      if (res?.success) {
        setShippingCharges(res.data);
      }
      setShippingChargeLoading(false);
    });
  }, []);

  const [selectedPaymentMethod] = useState<"COD" | "SSLCOMMERZ" | null>(null);
  const selectedShippingCharge =
    shippingCharges.find((_) => _.id === parseInt(contextValue!.values.shippingChargeId)) ||
    shippingCharges[0];

  const [removeCartItemsAfterPurchase, setRemoveCartItemsAfterPurchase] = useState(true);

  return (
    <div className="p-5 bg-white">
      <h1 className="uppercase text-2xl font-medium text-center">Your order</h1>
      <div className="mt-3">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
              <tr>
                <th scope="col" className="px-6 py-3 ">
                  Product name
                </th>
                <th scope="col" className="px-6 py-3">
                  Qty
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((_) => (
                <tr key={_.id} className="bg-white ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {_.product.name}
                  </th>
                  <td className="px-6 py-4 text-black">{_.quantity}</td>
                  <td className="px-6 py-4 text-primary font-medium">
                    {" "}
                    <span className="text-black">
                      <FaBangladeshiTakaSign className=" inline" />
                    </span>{" "}
                    {getCartItemPrice(_).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-900 ">
                <th scope="row" className="px-6 py-3 t">
                  SubTotal
                </th>
                <td className="px-6 py-3">{data?.items.reduce((p, c) => p + c.quantity, 0)}</td>
                <td className="px-6 py-3">
                  {" "}
                  <span className="text-black">
                    <FaBangladeshiTakaSign className=" inline" />
                  </span>{" "}
                  {data?.grandTotal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-3 pb-4 border-b border-gray-700/10">
          <div className="py-2 bg-gray-200 text-center font-medium">Shipping</div>
          <div className="mt-3 space-y-2">
            {shippingCharges.map((item, index) => (
              <div
                key={index}
                className="flex flex-col  flex-wrap gap-2  px-2 py-3 rounded-md bg-primary text-white"
              >
                <input
                  value={item.id}
                  type="radio"
                  defaultChecked={index === 0}
                  name="shippingChargeId"
                  className="size-5 accent-info"
                />
                <label htmlFor="" className="text-wrap">
                  {item.title}
                </label>
              </div>
            ))}
          </div>
        </div>
        {data && !isShippingChargeLoading && (
          <div className="space-y-2">
            <p className="mt-2 flex justify-between items-center font-medium md:text-xl">
              <span>Subtotal</span>
              <span className="text-primary">{data.subtotal.toFixed(2)} BDT</span>
            </p>
            <p className="mt-2 flex justify-between items-center font-medium md:text-xl">
              <span>Discount</span>
              <span className="text-primary">{data.discountTotal.toFixed(2)} BDT</span>
            </p>
            <p className="mt-2 flex justify-between items-center font-medium md:text-xl">
              <span>Shipping Charge</span>
              <span className="text-primary">
                {(selectedShippingCharge?.cost || 0).toFixed(2)} BDT
              </span>
            </p>
            <p className="mt-2 flex justify-between items-center font-medium md:text-xl">
              <span>Total</span>
              <span className="text-primary">
                {(data!.grandTotal + (selectedShippingCharge?.cost || 0)).toFixed(2)} BDT
              </span>
            </p>
          </div>
        )}
        <div className="mt-3 space-y-2 ">
          {paymentMethods.map((method, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                value={method.value}
                name="paymentMethod"
                className="size-5 accent-info"
              />
              <label htmlFor="" className="md:text-lg font-medium text-gray-700">
                {method.name}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="flex items-center flex-wrap gap-2">
            <input
              defaultChecked
              onChange={(e) => setRemoveCartItemsAfterPurchase(e.target.checked)}
              id="removeItem"
              type="checkbox"
              className="size-4 "
            />
            <label htmlFor="removeItem">Remove items from cart after purchase </label>
          </div>
        </div>
        <div className="mt-3 py-2 border-t border-gray-800/15">
          <p className="text-gray-800 text-sm">
            Your personal data will be used to process your order, support your experience
            throughout this website, and for other purposes described in our privacy policy.
          </p>
        </div>

        <div className="mt-3">
          <button
            disabled={!contextValue?.isValid}
            type="submit"
            className="py-4 bg-primary disabled:bg-gray-100 disabled:text-gray-600 text-white uppercase w-full"
          >
            {values?.paymentMethod === "COD" ? "PLACE ORDER" : "CHECKOUT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetails;

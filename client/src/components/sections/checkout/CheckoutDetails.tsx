import React from "react";

const CheckoutDetails = () => {
  const orderItems: { name: string; price: number; quantity: number }[] = [
    { name: "Wireless Mouse", price: 25.99, quantity: 2 },
    { name: "Mechanical Keyboard", price: 89.99, quantity: 1 },
    { name: "USB-C Hub", price: 39.99, quantity: 1 },
    { name: "Noise-Canceling Headphones", price: 129.99, quantity: 1 },
    { name: "Smartphone Stand", price: 15.99, quantity: 3 },
  ];

  const shippingCharges = [
    {
      title: "Inside Dhaka Home Delivery-DMP Only(24-48Hr):",
      amount: 300,
    },
    {
      title: "Outside Dhaka Home Delivery (24-96Hrs):",
      amount: 500,
    },
    {
      title:
        "Express Delivery -Advaance Payment Required Order Day Express Delivery -Advance payment required (Only DMP):",
      amount: 1000,
    },
  ];

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

  return (
    <div className="p-5 bg-white">
      <h1 className="uppercase text-2xl font-medium text-center">Your order</h1>
      <div className="mt-3">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
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
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4">$2999</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Microsoft Surface Pro
                </th>
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4">$1999</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Magic Mouse 2
                </th>
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4">$99</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-900 dark:text-white">
                <th scope="row" className="px-6 py-3 t">
                  SubTotal
                </th>
                <td className="px-6 py-3">3</td>
                <td className="px-6 py-3">21,000</td>
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
                <input type="radio" name="shippingCharge" className="size-5 accent-info" />
                <label htmlFor="" className="text-wrap">
                  {item.title}
                </label>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 flex justify-between items-center font-medium text-xl">
          <span>Total</span>
          <span className="text-primary">2000 BDT</span>
        </p>

        <div className="mt-3 space-y-2 ">
          {paymentMethods.map((method) => (
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value={method.value}
                name="paymentMethod"
                className="size-5 accent-info"
              />
              <label htmlFor="" className="text-lg font-medium text-gray-700">
                {method.name}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-3 py-2 border-t border-gray-800/15">
          <p className="text-gray-800 text-sm">
            Your personal data will be used to process your order, support your experience
            throughout this website, and for other purposes described in our privacy policy.
          </p>
        </div>

        <div className="mt-3">
          <button className="py-4 bg-primary text-white uppercase w-full">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetails;

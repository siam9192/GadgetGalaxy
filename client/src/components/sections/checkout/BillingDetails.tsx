"use client";

import { useCurrentUser } from "@/provider/CurrentUserProvider";
import { TCustomerAddress } from "@/types/user.type";
import React, { useEffect, useState } from "react";

const BillingDetails = () => {
  const { user } = useCurrentUser();
  const [customerAddresses, setCustomerAddresses] = useState<TCustomerAddress[]>([]);

  const [isCustomAddress, setIsCustomAddress] = useState(false);
  useEffect(() => {
    const addresses = user?.addresses;
    if (user && user.addresses) {
      setCustomerAddresses(user.addresses);
    }
    setIsCustomAddress(addresses?.length ? false : true);
  }, [user]);

  const isDefaultAddressExist = customerAddresses.find((_) => _.isDeleted === true);

  return (
    <div className="bg-white p-5">
      <h1 className="uppercase text-2xl font-medium">DELIVERY Details</h1>
      <div className="mt-3 space-y-4">
        <div>
          <label className="  block text-start 0font-medium text-[1rem]" htmlFor="fullName">
            Full name*
          </label>

          <input
            className={
              "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
            }
            defaultValue={user?.fullName}
            type="text"
            name="fullName"
          />
        </div>

        {isCustomAddress === true ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className=" font-medium text-gray-800 text-lg">Delivery Address:</h3>
              {customerAddresses.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsCustomAddress(false)}
                  className="mt-1 text-primary font-medium float-right"
                >
                  Use from saved address
                </button>
              ) : null}
            </div>

            <div>
              <label className="  block text-start 0font-medium text-[1rem]" htmlFor="fullName">
                District
              </label>
              <input
                className={
                  "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                }
                type="text"
                name="address.district"
              />
            </div>
            <div>
              <label className="  block text-start 0font-medium text-[1rem]" htmlFor="fullName">
                Zone
              </label>
              <input
                className={
                  "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                }
                type="text"
                name="address.zone"
              />
            </div>
            <div>
              <label className="  block text-start 0font-medium text-[1rem]" htmlFor="fullName">
                Line
              </label>
              <input
                className={
                  "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                }
                type="text"
                name="address.line"
              />
            </div>
          </div>
        ) : null}

        {isCustomAddress === false && customerAddresses.length ? (
          <div>
            <div className="flex items-center justify-between">
              <h3 className=" font-medium text-gray-800">My Saved Addresses:</h3>
              <button
                type="button"
                onClick={() => setIsCustomAddress(true)}
                className="text-primary font-medium"
              >
                Use new address
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {customerAddresses.map((address, index) => {
                function capitalizeFirstWord(str: string) {
                  return str.replace(/\b\w/, (c) => c.toUpperCase());
                }

                const str: string = Object.entries({
                  district: address.district,
                  zone: address.zone,
                  line: address.line,
                })
                  .reduce((acc, [key, value]) => {
                    acc.push(`${capitalizeFirstWord(key)}:${value || "N/A"}`);
                    return acc;
                  }, [] as string[])
                  .join(", ");
                return (
                  <div
                    key={index}
                    className="flex flex-col  flex-wrap gap-2  px-2 py-3 rounded-md  border-2 border-gray-700/20 text-white"
                  >
                    <input
                      type="radio"
                      defaultChecked={
                        isDefaultAddressExist
                          ? address.id === isDefaultAddressExist.id
                          : index === 0
                      }
                      name="addressId"
                      value={address.id}
                      className="size-5 accent-info"
                    />
                    <label htmlFor="" className="text-wrap text-black">
                      {str}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        <div>
          <label className="  block text-start 0font-medium text-[1rem]" htmlFor="fullName">
            Email*
          </label>

          <input
            className={
              "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
            }
            type="text"
            name="emailAddress"
            defaultValue={user?.email}
          />
        </div>

        <div>
          <label className="  block text-start 0font-medium text-[1rem]" htmlFor="phoneNumber">
            Phone number*
          </label>

          <input
            className={
              "w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
            }
            defaultValue={user?.phoneNumber}
            type="text"
            name="phoneNumber"
          />
        </div>

        <div>
          <label className="  block text-start 0font-medium text-[1rem]" htmlFor="fullName">
            Order notes (optional)
          </label>

          <textarea
            name="notes"
            id=""
            placeholder="Notes about your order etc."
            className="w-full mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary h-52 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;

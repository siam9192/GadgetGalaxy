"use client";
import Form from "@/components/hook-form/Form";
import FormInput from "@/components/hook-form/FormInput";
import React from "react";
import { IoCameraOutline } from "react-icons/io5";

const page = () => {
  return (
    <div className="bg-white md:p-10 p-5">
      {/* Profile Photo */}
      <div className="flex md:flex-row  flex-col  items-center gap-8">
        <div className="size-fit  relative">
          <img
            src="https://t4.ftcdn.net/jpg/02/24/86/95/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg"
            alt=""
            className="size-28 md:size-32 aspect-square rounded-full"
          />
          <button className="p-2 bg-primary text-white absolute right-0 bottom-2 text-xl rounded-full border-2">
            <IoCameraOutline />
          </button>
        </div>
        <div className="flex items-center gap-2  font-primary font-medium">
          <button className="px-4 py-3 rounded-md bg-primary text-white">Upload New</button>
          <button className="px-4 py-3 rounded-md bg-gray-100  text-black">Delete Avatar</button>
        </div>
      </div>

      <div className="mt-5">
        <Form onSubmit={() => {}}>
          <div className="space-y-3">
            <FormInput
              name="name"
              label="Full Name"
              className="w-full mt-1 px-2 focus:bg-blue-50 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                className="w-full mt-1 px-2 focus:bg-blue-50 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                name="email"
                label="Email"
              />
              <FormInput
                className="w-full mt-1 px-2 focus:bg-blue-50 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
                name="mobileNumber"
                label="Mobile Number"
              />
            </div>

            <div>
              <label htmlFor="" className=" ">
                Gender
              </label>
              <div className="mt-1 flex items-center gap-4 ">
                <div className="flex items-center gap-2 px-4 py-4 border-2 rounded-md border-gray-500/15">
                  <input
                    type="radio"
                    name="gender"
                    id="gender-male"
                    className="size-5 accent-info"
                  />
                  <label htmlFor="gender-male">Male</label>
                </div>
                <div className="flex items-center gap-2 px-4 py-4 border-2 rounded-md border-gray-500/15">
                  <input
                    type="radio"
                    name="gender"
                    id="gender-female"
                    className="size-5 accent-info"
                  />
                  <label htmlFor="gender-male">Female</label>
                </div>
              </div>
            </div>
            <FormInput
              name="address"
              label="Address"
              className="w-full mt-1 px-2 focus:bg-blue-50 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
            />
          </div>
          <div className="mt-5">
            <button className="px-6 py-4 bg-primary text-white">Save Changes</button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default page;

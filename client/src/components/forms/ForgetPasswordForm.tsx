"use client";
import { forgetPassword } from "@/services/auth.service";
import { isValidEmail } from "@/utils/helpers";
import React, { useState } from "react";

interface IProps {
  close?: () => void | any;
}

const ForgetPasswordForm = ({ close }: IProps) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const reset = () => {
    setEmailAddress("");
    setErrorMessage("");
    setIsSuccess(false);
  };

  const handelSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await forgetPassword(emailAddress);
      if (res.success) {
        setIsSuccess(true);
      } else throw new Error(res.message);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isSuccess ? (
        <>
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-primary  font-primary ">Forget your Password</h1>
          </div>
          <img
            className="mx-auto"
            src="https://cdni.iconscout.com/illustration/premium/thumb/forgot-password-illustration-download-in-svg-png-gif-file-formats--man-forget-business-activity-pack-illustrations-3551744.png?f=webp"
            alt=""
          />
          <div className="mt-2 flex md:flex-row flex-col justify-center items-center gap-2">
            <input
              type="text"
              name="email"
              onChange={(e) => setEmailAddress(e.target.value)}
              className="lg:w-1/2 mt-1 px-2 py-3 placeholder:font-normal rounded-lg border-2 border-gray-600/10   font-medium outline-primary"
              placeholder="Enter your email here..."
            />
            <button
              type="button"
              onClick={handelSubmit}
              disabled={!isValidEmail(emailAddress) || isLoading}
              className="px-8 py-3 rounded-md bg-primary disabled:bg-gray-100 disabled:text-gray-700 text-white"
            >
              Submit
            </button>
          </div>
          {errorMessage && <p className="mt-2 text-info ">{errorMessage}</p>}
        </>
      ) : (
        <div>
          <img
            className="mx-auto"
            src="https://cdni.iconscout.com/illustration/premium/thumb/email-marketing-illustration-download-in-svg-png-gif-file-formats--content-startup-advertising-advertisement-promotion-business-pack-illustrations-2912093.png"
            alt=""
          />
          <div className="mt-2  space-y-1 text-center">
            <h1 className="text-center font-medium text-2xl">Please Check your email</h1>
            <p className="text-gray-800 text-sm w-10/12 mx-auto">
              We have sent an password reset link to your email ({emailAddress}),Use the link as
              soon as possible other wise it will expire soon
            </p>
          </div>
          <div className="mt-5 flex justify-center  gap-2">
            <button
              onClick={reset}
              type="button"
              className="px-8  py-3 hover:bg-primary border-2 border-blue-100 hover:text-white rounded-md"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => close && close()}
              className="px-8  py-3 bg-primary text-white rounded-md"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPasswordForm;

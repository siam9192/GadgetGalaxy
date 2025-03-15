"use client";
import OTPInput from "@/components/ui/OTPInput";
import React, { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import "@/styles/util.css";
import OtpVerificationSuccessful from "@/components/ui/OtpVerificationSuccessful";

interface IProps {
  closeFn: () => void;
  onVerify: () => void;
}
const VerifyOtp = ({ closeFn, onVerify }: IProps) => {
  const [isVerified, setIsVerified] = useState(false);

  const handelOnSubmit = () => {
    setIsVerified(true);
  };

  return (
    <div className="fixed inset-0 bg-black/30  flex items-center justify-center h-screen z-50 select-none">
      <div className="lg:w-1/3 md:w-10/12  md:h-fit min-h-60  w-full h-full flex flex-col justify-center items-center bg-white  p-5 rounded-md relative signup-otp-verify">
        {!isVerified ? (
          <>
            <img src="/images/otp.jpg" alt="" className="md:w-1/2  w-full mx-auto" />
            <div className="mt-3 md:space-y-4 space-y-2">
              <h1 className="text-black uppercase font-medium text-2xl text-center">
                Otp Verification
              </h1>
              <h4 className="text-center font-medium">Hello Siam,</h4>
              <p className="text-gray-700 text-sm text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, id.
              </p>
            </div>
            <div className="mt-3">
              <OTPInput />
              <p className="mt-4 text-center text-gray-700">
                OTP not received?{" "}
                <span className="text-lg uppercase font-medium text-primary">RESEND</span>
              </p>
            </div>

            <button
              onClick={handelOnSubmit}
              className="mt-5 w-full  py-3 rounded-lg bg-primary text-white hover:text-black hover:bg-secondary"
            >
              Submit
            </button>
            <button
              onClick={closeFn}
              className="text-4xl  text-gray-800 font-medium absolute left-4 top-4  md:hidden block "
            >
              <MdArrowBackIos />
            </button>
          </>
        ) : (
          <>
            <OtpVerificationSuccessful closeFn={closeFn} />
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;

"use client";
import OTPInput from "@/components/ui/OTPInput";
import React, { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import "@/styles/util.css";
import OtpVerificationSuccessful from "@/components/ui/OtpVerificationSuccessful";
import { resendOtp, verifySignupRequest } from "@/services/auth.service";
import { FaArrowLeftLong } from "react-icons/fa6";

interface IProps {
  closeFn: () => void;
  onVerify: () => void;
  token: string;
  email: string;
}
const VerifyOtp = ({ closeFn, onVerify, token, email }: IProps) => {
  const [response, setResponse] = useState({ token, email });
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendOtpIn, setResetOtpIn] = useState(30);
  const handelOnSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        otp,
        token,
      };

      const res = await verifySignupRequest(payload);
      if (!res.success) {
        throw new Error(res.message);
      }
      setIsVerified(true);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handelResendOtp = async () => {
    setIsLoading(true);
    try {
      const payload = {
        otp,
        token,
      };

      const res = await resendOtp(response.token);
      if (!res.success) {
        throw new Error(res.message);
      }

      setResponse(res.data!);
      setResetOtpIn(30);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resendOtpIn > 0) {
      const interval = setInterval(() => {
        setResetOtpIn((p) => {
          if (p <= 1) {
            clearInterval(interval);
            return 0;
          }
          return p - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [resendOtpIn]);

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
              <h4 className="text-center font-medium">Hello,</h4>
              <p className="text-gray-700 text-sm text-center">
                We’ve sent a 6-digit OTP to your registered email{" "}
                <span className="text-primary font-medium">{email}</span>. Please enter it below to
                verify your identity and continue.
              </p>
            </div>
            <div className="mt-3">
              <OTPInput onChange={(value) => setOtp(value)} />
              <p className="mt-4 text-center text-gray-700">
                OTP not received?{" "}
                <button
                  disabled={resendOtpIn !== 0}
                  onClick={handelResendOtp}
                  className="text-lg uppercase font-medium disabled:text-gray-600 text-primary"
                >
                  RESEND
                </button>
                {resendOtpIn > 0 ? `(${resendOtpIn}s)` : null}
              </p>
            </div>

            <button
              onClick={handelOnSubmit}
              disabled={otp.length !== 6 || isLoading}
              className="mt-5 w-full disabled:bg-gray-100 disabled:text-gray-800  py-3 rounded-lg bg-primary text-white hover:text-black hover:bg-secondary"
            >
              Submit
            </button>
            {errorMessage && <p className="text-info mt-2">{errorMessage}</p>}
            <button
              onClick={closeFn}
              className="text-4xl  text-gray-800 font-medium absolute left-4 top-4  md:hidden block "
            >
              <MdArrowBackIos />
            </button>
            <button onClick={closeFn} className="text-2xl absolute left-4 top-4">
              <FaArrowLeftLong />
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

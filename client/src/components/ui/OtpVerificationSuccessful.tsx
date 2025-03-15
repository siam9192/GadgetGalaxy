import Link from "next/link";
import React from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";

interface IProps {
  closeFn: () => void;
}
const OtpVerificationSuccessful = ({ closeFn }: IProps) => {
  return (
    <div className="otp-verify-success">
      <img src="/images/otp.png" alt="" className=" md:w-1/2   mx-auto" />
      <div className="mt-3 md:space-y-3 space-y-2">
        <div className="flex justify-center items-center gap-2">
          <span className="md:text-4xl text-3xl text-green-600">
            <BsFillPatchCheckFill />
          </span>
          <h1 className="text-black uppercase font-medium md:text-2xl text-xl ">
            SUCCESSFULLY VERIFIED!
          </h1>
        </div>
        <h4 className="text-center  text-gray-700 text-sm">you can login your account now</h4>
      </div>
      <div className="mt-5 flex items-center justify-center gap-4">
        <Link href="/login">
          <button className="px-4 py-2 bg-primary text-white rounded-md">Go to Login</button>
        </Link>
        <button onClick={closeFn} className="px-4 py-2 bg-secondary text-black rounded-md">
          Not now
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationSuccessful;

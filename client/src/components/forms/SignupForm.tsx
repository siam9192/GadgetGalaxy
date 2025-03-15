"use client";
import React, { useEffect, useState } from "react";
import Form from "../hook-form/Form";
import FormInput from "../hook-form/FormInput";
import AuthProviderButtons from "../ui/AuthProviderButtons";
import Link from "next/link";
import VerifyOtp from "../sections/signup/VerifyOtp";

const SignupForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handelOnSubmit = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);
  return (
    <>
      <Form onSubmit={handelOnSubmit} className="h-full bg-white">
        <h1 className="text-4xl  text-black font-semibold font-primary ">Signup</h1>
        <div className="mt-10 space-y-4">
          <FormInput name="name" label="Full name*" />
          <FormInput name="email" label="Email*" />
          <FormInput name="password" label="Password*" />
          <FormInput name="password" label="Confirm password*" />
        </div>

        <div className="text-center mt-2">
          <button className="font-medium text-black">
            Already have an account?{" "}
            <Link href={"/login"}>
              <span className="text-primary font-medium">Login</span>
            </Link>
          </button>
        </div>
        <button
          type="submit"
          className="mt-5 w-full py-3 text-white bg-primary  hover:bg-secondary hover:text-black font-medium rounded-lg"
        >
          Sign Up
        </button>
        <div className="relative mt-5">
          <p className=" after:w-1/3 md:after:translate-x-14 after:translate-x-5 after:left-0  after:top-1/2 after:pr-4  after:absolute after:h-[2px] after:bg-gray-500/30 before:w-1/3  md:before:-translate-x-14 before:-translate-x-5 before:right-0  before:top-1/2   before:absolute before:h-[2px] before:bg-gray-500/30 text-center">
            Or
          </p>
        </div>
        <AuthProviderButtons />
      </Form>
      {isOpen ? <VerifyOtp closeFn={() => setIsOpen(false)} onVerify={() => {}} /> : null}
    </>
  );
};

export default SignupForm;

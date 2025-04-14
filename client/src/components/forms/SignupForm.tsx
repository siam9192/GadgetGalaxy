"use client";
import React, { useEffect, useState } from "react";
import Form from "../hook-form/Form";
import FormInput from "../hook-form/FormInput";
import AuthProviderButtons from "../ui/AuthProviderButtons";
import Link from "next/link";
import VerifyOtp from "../sections/signup/VerifyOtp";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthValidations from "@/validations/AuthValidation";
import { signup } from "@/services/auth.service";

const SignupForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState({ token: "", email: "" });

  const resetState = () => {
    setIsOpen(false);
    setErrorMessage("");
    setIsLoading(false);
    setResponse({ token: "", email: "" });
  };

  const handelOnSubmit = async (values: any) => {
    setErrorMessage("");
    setIsLoading(true);
    setResponse({ token: "", email: "" });
    try {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      };

      const res = await signup(payload);
      if (!res.success) {
        throw new Error(res.message);
      }
      setResponse(res.data!);
      setIsOpen(true);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      <Form
        onSubmit={handelOnSubmit}
        resolver={zodResolver(AuthValidations.SignupValidation)}
        reset
        className="h-full bg-white"
      >
        <h1 className="text-4xl  text-black font-semibold font-primary ">Signup</h1>
        <div className="mt-10 space-y-4">
          <FormInput name="fullName" label="Full name*" />
          <FormInput name="email" label="Email*" />
          <FormInput name="password" label="Password*" />
          <FormInput name="confirmPassword" label="Confirm password*" />
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
          disabled={isLoading}
          className="mt-5 w-full py-3 text-white bg-primary  hover:bg-secondary hover:text-black font-medium rounded-lg"
        >
          Sign Up
        </button>
        {errorMessage && <p className="text-info mt-2">{errorMessage}</p>}
        <div className="relative mt-5">
          <p className=" after:w-1/3 md:after:translate-x-14 after:translate-x-5 after:left-0  after:top-1/2 after:pr-4  after:absolute after:h-[2px] after:bg-gray-500/30 before:w-1/3  md:before:-translate-x-14 before:-translate-x-5 before:right-0  before:top-1/2   before:absolute before:h-[2px] before:bg-gray-500/30 text-center">
            Or
          </p>
        </div>
        <AuthProviderButtons />
      </Form>
      {isOpen ? <VerifyOtp {...response} closeFn={resetState} onVerify={() => {}} /> : null}
    </>
  );
};

export default SignupForm;

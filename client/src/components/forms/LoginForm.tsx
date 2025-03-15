"use client";
import React from "react";
import Form from "../hook-form/Form";
import FormInput from "../hook-form/FormInput";
import AuthProviderButtons from "../ui/AuthProviderButtons";
import Link from "next/link";

const LoginForm = () => {
  const handelOnSubmit = () => {};
  return (
    <Form onSubmit={handelOnSubmit} className="h-full bg-white">
      <h1 className="text-4xl  text-black font-semibold font-primary ">Login</h1>
      <div className="mt-10 space-y-4">
        <FormInput name="email" label="Email" />
        <FormInput name="password" label="Password*" />
      </div>
      <div className="text-end mt-2">
        <button className="font-medium text-info">Forget password</button>
      </div>
      <div className="text-center mt-2">
        <button className="font-medium text-black">
          Don't have an account?{" "}
          <Link href={"/signup"}>
            <span className="text-primary font-medium">Signup</span>
          </Link>
        </button>
      </div>
      <button className="mt-5 w-full py-3 text-white bg-primary  hover:bg-secondary hover:text-black font-medium rounded-lg">
        Sign Up
      </button>
      <div className="relative mt-5">
        <p className=" after:w-1/3 md:after:translate-x-14 after:translate-x-5 after:left-0  after:top-1/2 after:pr-4  after:absolute after:h-[2px] after:bg-gray-500/30 before:w-1/3  md:before:-translate-x-14 before:-translate-x-5 before:right-0  before:top-1/2   before:absolute before:h-[2px] before:bg-gray-500/30 text-center">
          Or
        </p>
      </div>
      <AuthProviderButtons />
    </Form>
  );
};

export default LoginForm;

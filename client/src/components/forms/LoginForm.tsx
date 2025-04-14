"use client";
import React, { useState } from "react";
import Form from "../hook-form/Form";
import FormInput from "../hook-form/FormInput";
import AuthProviderButtons from "../ui/AuthProviderButtons";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthValidations from "@/validations/AuthValidation";
import { Bounce, toast } from "react-toastify";
import { login } from "@/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import ForgetPasswordPopup from "../ui/ForgetPasswordPopup";
import { useCurrentUser } from "@/provider/CurrentUserProvider";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refetch } = useCurrentUser();

  const handelOnSubmit = async (values: any) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await login(values);
      if (!res.success) {
        throw new Error(res.message);
      }
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      const redirect = searchParams.get("redirect");
      refetch();
      if (redirect) {
        router.replace(redirect);
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      toast.error(`${error.message || "Something went wrong!"}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setErrorMessage(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      onSubmit={handelOnSubmit}
      resolver={zodResolver(AuthValidations.LoginValidationSchema)}
      className="h-full bg-white"
    >
      <h1 className="text-4xl   text-black font-semibold font-primary ">Login</h1>
      <div className="mt-10 space-y-4">
        <FormInput name="email" label="Email" />
        <FormInput name="password" type="password" label="Password*" />
      </div>
      <div className="flex justify-end mt-2">
        <ForgetPasswordPopup>
          <button type="button" className="font-medium text-info">
            Forget password?
          </button>
        </ForgetPasswordPopup>
      </div>
      <div className="text-center mt-2">
        <button className="font-medium text-black">
          Don't have an account?{" "}
          <Link href={"/signup"}>
            <span className="text-primary font-medium">Signup</span>
          </Link>
        </button>
      </div>
      <button
        disabled={isLoading}
        className="mt-5 w-full py-3 disabled:bg-gray-100 text-white bg-primary  hover:bg-secondary hover:text-black font-medium rounded-lg"
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
  );
};

export default LoginForm;

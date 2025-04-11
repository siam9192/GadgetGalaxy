"use client";
import React, { ChangeEvent, useState } from "react";
import Form from "../hook-form/Form";
import FormInput from "../hook-form/FormInput";
import { resetPassword } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthValidations from "@/validations/AuthValidation";
import { useParams, useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/provider/CurrentUserProvider";
import Link from "next/link";

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { token } = useParams();

  const handelSubmit = async (values: any) => {
    const { newPassword } = values;
    setErrorMessage("");
    setIsLoading(true);

    try {
      const payload = {
        newPassword,
        token,
      };
      const res = await resetPassword(payload);
      if (res.success) {
        setIsLoading(false);
        setIsSuccess(true);
        return true;
      } else throw new Error(res.message);
    } catch (error: any) {
      const message = error.message || "Something went wrong";

      setErrorMessage(message);
    }
    setIsLoading(false);
  };

  const type = showPassword ? "text" : "password";

  const handelShowPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setShowPassword(e.currentTarget.checked);
  };

  const { user } = useCurrentUser();
  return (
    <>
      {!isSuccess ? (
        <Form
          reset
          onSubmit={handelSubmit}
          resolver={zodResolver(AuthValidations.ResetPasswordValidation)}
          className="p-5 shadow-primary rounded-md"
        >
          <h1 className="text-2xl font-medium text-primary_color text-primary">
            Reset Your Password
          </h1>
          <div className="mt-5 space-y-4">
            <FormInput type={type} name="newPassword" label="New Password" />
            <FormInput type={type} name="confirmPassword" label="Confirm Password" />
            <div className="flex items-center gap-2 w-fit ">
              <input
                onChange={handelShowPassword}
                type="checkbox"
                id="showPassword"
                className="w-5 h-5  accent-secondary "
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
          </div>
          <button
            disabled={isLoading}
            className="mt-3 w-full py-3 bg-primary_color  rounded-md bg-primary text-white "
          >
            {isLoading ? "Processing..." : "Submit"}
          </button>
          {errorMessage && <p className="mt-1 text-red-500">{errorMessage}</p>}
        </Form>
      ) : (
        <div>
          <img
            className="w-1/2 mx-auto"
            src="https://static.vecteezy.com/system/resources/previews/005/163/927/non_2x/login-success-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
            alt=""
          />
          <div className="mt-2  space-y-1 text-center">
            <h1 className="text-center font-medium text-2xl">
              Your password has been reset successfully{" "}
            </h1>
            <p className="text-gray-800 text-sm w-10/12 mx-auto">
              Now you can use this password to continue authentication part
            </p>
          </div>
          <div className="mt-5 flex justify-center  gap-2">
            <Link href={user ? "/" : "/login"}>
              <button type="button" className="px-8  py-3 bg-primary text-white rounded-md">
                Ok
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPasswordForm;

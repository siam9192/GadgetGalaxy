import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center flex-col h-screen p-2">
      <div className="lg:w-1/2 md:w-10/12 w-full bg-white min-h-[50vh]  md:p-5 p-3">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default page;

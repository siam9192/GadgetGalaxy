import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import React from "react";

const page = () => {
  return (
    <div className="md:p-10 p-5 bg-white">
      <p className="text-primary font-medium text-sm">
        Password Last changed: {new Date().toDateString()}
      </p>
      <div className="mt-5">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default page;

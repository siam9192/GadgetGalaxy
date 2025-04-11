"use client";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { useCurrentUser } from "@/provider/CurrentUserProvider";
import React from "react";

const page = () => {
  const { user } = useCurrentUser();
  return (
    <div className="md:p-10 p-5 bg-white">
      {user?.passwordLastChangeAt && (
        <p className="text-primary font-medium text-sm">
          Password Last changed: {new Date(user?.passwordLastChangeAt).toDateString()}
        </p>
      )}
      <div className="mt-5">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default page;

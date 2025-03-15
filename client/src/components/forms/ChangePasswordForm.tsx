"use client";
import React from "react";
import Form from "../hook-form/Form";
import FormInput from "../hook-form/FormInput";

const ChangePasswordForm = () => {
  const handelSubmit = () => {};
  return (
    <Form onSubmit={handelSubmit}>
      <div className="space-y-4">
        <FormInput name="oldPassword" label="Old Password" />
        <FormInput name="newPassword" label="New Password" />
      </div>
      <div className="mt-5">
        <button className="px-6 py-4 bg-primary text-white">Change Password</button>
      </div>
      <div className="text-end">
        <button className="font-medium text-info">Forget Password?</button>
      </div>
    </Form>
  );
};

export default ChangePasswordForm;

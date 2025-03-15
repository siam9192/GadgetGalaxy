import FormInput from "@/components/hook-form/FormInput";
import FormTextArea from "@/components/hook-form/FormTextarea";
import React from "react";

const BillingDetails = () => {
  return (
    <div className="bg-white p-5">
      <h1 className="uppercase text-2xl font-medium">Billing Details</h1>
      <div className="mt-3 space-y-4">
        <FormInput name="fullName" label="Full name*" />
        <FormInput name="address" label="Full address*" />
        <FormInput
          name="address"
          placeholder="Enter your 11 digit of phone number"
          label="Phone number"
        />
        <FormTextArea
          name="notes"
          label="Order notes (optional)"
          placeholder="Notes about your order etc."
        />
      </div>
    </div>
  );
};

export default BillingDetails;

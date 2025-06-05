"use client";
import BillingDetails from "@/components/sections/checkout/BillingDetails";
import CheckoutDetails from "@/components/sections/checkout/CheckoutDetails";
import { orderInit, placeOrder } from "@/services/order.service";
import { TCheckoutData } from "@/types/util.type";
import { getFormValues } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

export type TCheckoutContextValue = {
  isValid: boolean;
  values: Record<string, string>;
  errors: Record<string, string>;
};

export const checkoutContext = createContext<TCheckoutContextValue | null>(null);

const page = () => {
  const [isValid, setIsValid] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const value: TCheckoutContextValue = {
    isValid,
    values,
    errors,
  };

  const router = useRouter();

  const validateCheckoutForm = (target: HTMLFormElement) => {
    const values = getFormValues(target, [
      "fullName",
      "addressId",
      "address.district",
      "address.zone",
      "address.line",
      "phoneNumber",
      "emailAddress",
      "notes",
      "shippingChargeId",
      "paymentMethod",
    ]);

    const errors: Record<string, string> = {};
    let isValid = true;

    // Full name
    if (!values.fullName || values.fullName.trim() === "") {
      errors.fullName = "Full name is required.";
      isValid = false;
    }

    if (!values.emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailAddress)) {
      errors.emailAddress = "Email address is required";
      isValid = false;
    }
    // Address validation
    if (typeof values.addressId !== "undefined") {
      if (!values.addressId || values.addressId.trim() === "") {
        errors.addressId = "Address is required.";
        isValid = false;
      }
    } else {
      // Validate new address fields
      if (!values["address.district"] || values["address.district"].trim() === "") {
        errors["address.district"] = "District is required.";
        isValid = false;
      }
      if (!values["address.zone"] || values["address.zone"].trim() === "") {
        errors["address.zone"] = "Zone is required.";
        isValid = false;
      }
      if (!values["address.line"] || values["address.line"].trim() === "") {
        errors["address.line"] = "Address line is required.";
        isValid = false;
      }
    }

    // Phone number
    if (!values.phoneNumber || values.phoneNumber.trim() === "") {
      errors.phoneNumber = "Phone number is required.";
      isValid = false;
    } else if (!/^\+?\d{7,15}$/.test(values.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number format.";
      isValid = false;
    }

    // Shipping charge
    if (!values.shippingChargeId || values.shippingChargeId.trim() === "") {
      errors.shippingChargeId = "Shipping method is required.";
      isValid = false;
    }

    // Payment method
    if (!values.paymentMethod || values.paymentMethod.trim() === "") {
      errors.paymentMethod = "Payment method is required.";
      isValid = false;
    }

    values.removeCartItemsAfterPurchase = target.removeItem.checked;

    return {
      isValid,
      errors,
      values,
    };
  };

  const handelCheckout = async (values: any) => {
    const data: TCheckoutData = JSON.parse(localStorage.getItem("checkout-data")!);
    const orderData: any = {
      shippingChargeId: parseInt(values.shippingChargeId),
      shippingInfo: {
        fullName: values?.fullName,
        emailAddress: values?.emailAddress,
        phoneNumber: values?.phoneNumber,
      },
      cartItemsId: data?.items.map((_) => _.id),
      removeCartItemsAfterPurchase: values.removeCartItemsAfterPurchase,
    };
    if (values.addressId) {
      orderData.shippingInfo.addressId = values.addressId;
    } else {
      orderData.shippingInfo.address = {
        district: values["address.district"],
        zone: values["address.zone"],
        line: values["address.line"],
      };
    }

    if (data?.discountCode) orderData.discountCode = data.discountCode;

    if (values.notes) {
      orderData.notes = values.notes;
    }
    try {
      if (values.paymentMethod !== "COD") {
        const res = await orderInit(orderData);

        if (res.success) {
          window.location.href = res.data?.paymentUrl!;
        } else {
          throw new Error(res.message);
        }
      } else {
        const res = await placeOrder(orderData);

        if (res.success) {
          router.replace("/order-success");
        } else {
          throw new Error(res.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handelSubmit = (e: any) => {
    e.preventDefault();
    const { errors, isValid, values } = validateCheckoutForm(e.target as HTMLFormElement);
    if (!isValid) {
      setIsValid(false);
      setErrors(errors);
      return;
    }

    handelCheckout(values);
  };

  return (
    <div className="lg:py-10 py-6">
      <div className="p-5 bg-white">
        <h1 className="md:text-3xl text-2xl  font-primary uppercase font-semibold text-gray-900">
          Checkout
        </h1>
      </div>
      <checkoutContext.Provider value={value}>
        <form
          onSubmit={handelSubmit}
          onChange={(e) => {
            const { isValid, errors, values } = validateCheckoutForm(
              e.currentTarget as HTMLFormElement,
            );
            setIsValid(isValid);
            setErrors(errors);
            setValues(values);
          }}
        >
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 py-5 ">
            <BillingDetails />
            <CheckoutDetails />
          </div>
        </form>
      </checkoutContext.Provider>
    </div>
  );
};

export default page;

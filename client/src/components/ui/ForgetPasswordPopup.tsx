"use client";
import React, { ReactNode, useEffect, useState } from "react";
import ForgetPasswordForm from "../forms/ForgetPasswordForm";

const ForgetPasswordPopup = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);
  return (
    <>
      <div onClick={() => setIsOpen(true)} className="size-fit">
        {children}
      </div>
      {isOpen ? (
        <div
          onClick={() => setIsOpen(false)}
          className=" bg-gray-900/50 fixed inset-0 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="lg:w-1/2 md:w-1/2 w-[90%] bg-white min-h-60 md:p-10 p-5 rounded-xl overflow-y-auto no-scrollbar"
          >
            <ForgetPasswordForm close={() => setIsOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ForgetPasswordPopup;

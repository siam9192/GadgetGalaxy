"use client";
import React, { useEffect, useRef, useState } from "react";
import "@/styles/util.css";
const OTPInput = ({ length = 6 }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="grid grid-cols-6 gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="number"
          value={digit}
          maxLength={1}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => (inputRefs.current[index] = el as any)}
          className=" otp-input w-full md:h-20 h-18  text-center text-3xl border-2 focus:outline-2 outline-info  focus:border-none border-gray-800/40 rounded-md focus:border-blue-500 text-primary font-semibold font-primary"
        />
      ))}
    </div>
  );
};

export default OTPInput;

"use client";
import useCountdown from "@/hooks/useCountDown";
import React, { useEffect, useState } from "react";

const BestDealCounter = () => {
  const [isClient, setIsClient] = useState(false);

  // Use effect for ssr = false for this component
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isClient) return;
      setIsClient(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const date = new Date("2026-04-24");

  date.setDate(date.getDate() + 10);

  const { days, hours, minutes, seconds } = useCountdown(date);

  if (!isClient) return null;
  return (
    <div className="mt-2">
      <div className="flex font-primary">
        {/* Days */}
        <div className="md:py-2 md:px-4 px-2 py-1 border border-gray-600/10 bg-gray-100 font-medium text-center ">
          <span className=" md:text-xl text-[1rem] font-bold text-black">
            {days < 10 ? 0 : ""}
            {days}
          </span>
          <p className="text-gray-600 text-sm">Days</p>
        </div>
        {/* Hours */}
        <div className="md:py-2 md:px-4 px-2 py-1 border border-gray-600/10 bg-gray-100 font-medium text-center ">
          <span className=" md:text-xl text-[1rem] font-bold text-black">
            {" "}
            {hours < 10 ? 0 : ""}
            {hours}
          </span>
          <p className="text-gray-600 text-sm">Hours</p>
        </div>
        {/* Minutes */}
        <div className="md:py-2 md:px-4 px-2 py-1 border border-gray-600/10 bg-gray-100 font-medium text-center ">
          <span className=" md:text-xl text-[1rem] font-bold text-black">
            {minutes < 10 ? 0 : ""}
            {minutes}
          </span>
          <p className="text-gray-600 text-sm">Minutes</p>
        </div>
        {/* Seconds */}
        <div className="md:py-2 md:px-4 px-2 py-1 border border-gray-600/10 bg-gray-100 font-medium text-center ">
          <span className=" md:text-xl text-[1rem] font-bold text-black">
            {seconds < 10 ? 0 : ""}
            {seconds}
          </span>
          <p className="text-gray-600 text-sm">Seconds</p>
        </div>
      </div>
    </div>
  );
};

export default BestDealCounter;

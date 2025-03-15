"use client";
import React, { ReactNode } from "react";

interface IProps {
  data: {
    title: string;
    icon: ReactNode;
    value: number;
  };
}
export const SummaryCard = ({ data }: IProps) => {
  return (
    <div className="p-5">
      <h1 className="text-info text-4xl  text-center font-primary font-bold">{data.value}</h1>
      <div className="flex items-center gap-2">
        <div className="text-3xl p-2 bg-blue-100 size-fit rounded-full text-primary">
          {data.icon}
        </div>
        <h6 className="text-lg font-medium">{data.title}</h6>
      </div>
    </div>
  );
};

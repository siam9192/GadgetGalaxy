import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  className?: string;
}
const Container = ({ children, className }: IProps) => {
  return (
    <div className={`max-w-[1400px] mx-auto lg:px-0 md:px-20 p-2 ${className || ""}`}>
      {children}
    </div>
  );
};

export default Container;

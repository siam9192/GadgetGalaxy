import React from "react";
import Container from "@/components/container/Container";

interface IProps {
  children: React.ReactNode;
}
const layout = ({ children }: IProps) => {
  return children;
};

export default layout;

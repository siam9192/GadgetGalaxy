import Container from "@/components/container/Container";
import React from "react";


interface IProps {
  children:React.ReactNode
}
const layout = ({ children }: IProps) => {
  return <Container>{children}</Container>;
};

export default layout;
